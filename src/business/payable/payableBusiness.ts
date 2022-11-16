import PayableRepositoryInterface from "../repositoryInterface/payable/payableRepositoryInterface";
import HashManagerUtils from "../../utils/hashManagerUtils";
import IdGeneratorUtils from "../../utils/idGeneratorUtils";
import TokenGeneratorUtils from "../../utils/tokenGeneratorUtils";
import PayableInputDTO from "../../model/playable/playableDto/payableInputDto";
import paymentStatus from "../../model/enums/paymentStatus";
import Payable from "../../model/playable/payable";
import moment from "moment";
import PayableStatusInputDto from "../../model/playable/playableDto/payableStatusInputDto";
import TransferPayableInputDto from "../../model/playable/playableDto/transferPayableInputDto";

export default class PayableBusiness {

    private payableData: PayableRepositoryInterface
    private hashManagerUtils: HashManagerUtils
    private idGeneratorUtils: IdGeneratorUtils
    private tokenGeneratorUtils: TokenGeneratorUtils

    constructor(payableDataImplementation: PayableRepositoryInterface) {
        this.payableData = payableDataImplementation
        this.hashManagerUtils = new HashManagerUtils()
        this.idGeneratorUtils = new IdGeneratorUtils()
        this.tokenGeneratorUtils = new TokenGeneratorUtils()
    }

    depositPayable = async (input: PayableInputDTO) => {
        let depositAmounts = 0
        let holderTotalAmount = 0
        let someAccountValue = 0

        const { token, paymentMethod, value, description, cardNumber, cvv } = input

        if (!token) {
            throw new Error("Token inexistente ou inválido.")
        }
        const verifyToken = this.tokenGeneratorUtils.getTokenData(token)
        if (!verifyToken) {
            throw new Error("Token inexistente ou inválido.")
        }

        if (!token || !paymentMethod || !value || !description || !cardNumber || !cvv) {
            throw new Error("Algum campo não foi preenchido")
        }

        if (value > 2000) {
            throw new Error("Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000")
        }
        if (value < 0) {
            throw new Error("Não é possível inserir um valor negativo")
        }

        const checkCardCustomer = await this.payableData.getCustomerCard(verifyToken.id)

        const verifyCard = await this.hashManagerUtils.compare(cardNumber, checkCardCustomer!.getCardNumber())

        if (!verifyCard) {
            throw new Error("Verifique o número do seu cartão")
        }

        const verifyCvv = await this.hashManagerUtils.compare(cvv, checkCardCustomer!.getCvv())
        if (!verifyCvv) {
            throw new Error("Verifique o número do seu do cvv")
        }

        let status: paymentStatus | any
        let updatedValue: number | any
        let paymentDate: any

        if (paymentMethod === 'DEBIT_CARD') {
            status = paymentStatus.paid
            updatedValue = (value - value * 0.3)
            paymentDate = moment().format('YYYY-MM-DD')
        } else if (paymentMethod === 'CREDIT_CARD') {
            status = paymentStatus.waiting_funds
            updatedValue = (value - value * 0.05);
            paymentDate = moment().add(30, 'days').format('YYYY-MM-DD HH')
        }

        depositAmounts += value
        holderTotalAmount = checkCardCustomer!.getAmount()
        someAccountValue = holderTotalAmount + updatedValue

        await this.payableData.updateAmountCard(checkCardCustomer!.getIdCustomer(), someAccountValue)
        const id = this.idGeneratorUtils.generateId()
        const dateCreated = new Date()
        const card = checkCardCustomer!.getLastNumber()

        const payable = new Payable(
            id,
            status,
            paymentDate,
            dateCreated,
            updatedValue,
            description,
            card,
            verifyToken.id
        )

        await this.payableData.createPayable(payable)

        const message = {
            deposito: `O valor de R$:${updatedValue} foi depositado na sua conta`,
            total: `A sua conta agora possui o total de R$:${someAccountValue}`
        }

        return message
    }

    transferPayable = async (input: TransferPayableInputDto) => {
        let transferAmounts = 0
        let holderTotalAmount = 0
        let recipientWallet = 0
        let subtractAccountValue = 0

        const { token, paymentMethod, value, description, cardNumber, cvv, idTransferCustomer } = input

        if (!token) {
            throw new Error("Token inexistente ou inválido.")
        }
        const verifyToken = this.tokenGeneratorUtils.getTokenData(token)
        if (!verifyToken) {
            throw new Error("Token inexistente ou inválido.")
        }

        if (!token || !paymentMethod || !value || !description || !cardNumber || !cvv || !idTransferCustomer) {
            throw new Error("Algum campo não foi preenchido")
        }

        if (value > 2000) {
            throw new Error("Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000")
        }
        if (value < 0) {
            throw new Error("Não é possível inserir um valor negativo")
        }

        const checkCardCustomer = await this.payableData.getCustomerCard(verifyToken.id)

        const verifyCard = await this.hashManagerUtils.compare(cardNumber, checkCardCustomer!.getCardNumber())

        if (!verifyCard) {
            throw new Error("Verifique o número do seu cartão")
        }

        const verifyCvv = await this.hashManagerUtils.compare(cvv, checkCardCustomer!.getCvv())
        if (!verifyCvv) {
            throw new Error("Verifique o número do seu do cvv")
        }

        const searchCard = await this.payableData.getCustomerCard(idTransferCustomer)
        if (!searchCard) {
            throw new Error("O Receptor não foi localizado")
        }

        let status: paymentStatus | any
        let updatedValue: number | any
        let paymentDate: any

        if (paymentMethod === 'DEBIT_CARD') {
            status = paymentStatus.paid
            updatedValue = (value - value * 0.3)
            paymentDate = moment().format('YYYY-MM-DD')
        } else if (paymentMethod === 'CREDIT_CARD') {
            status = paymentStatus.waiting_funds
            updatedValue = (value - value * 0.05);
            paymentDate = moment().add(30, 'days').format('YYYY-MM-DD HH')
        }

        transferAmounts += value
        holderTotalAmount = checkCardCustomer!.getAmount()

        if (transferAmounts > holderTotalAmount) {
            throw new Error(`O valor da transferência é maior que o saldo da sua conta. O seu saldo atual é de R$:${checkCardCustomer!.getAmount()} `)
        } else {
            subtractAccountValue = holderTotalAmount - transferAmounts
            await this.payableData.updateAmountCard(checkCardCustomer!.getIdCustomer(), subtractAccountValue)
            recipientWallet += searchCard!.getAmount()
            const someValue = recipientWallet + updatedValue
            await this.payableData.updateAmountCard(searchCard!.getIdCustomer(), someValue)
        }

        const id = this.idGeneratorUtils.generateId()
        const dateCreated = new Date()
        const card = checkCardCustomer!.getLastNumber()

        const payable = new Payable(
            id,
            status,
            paymentDate,
            dateCreated,
            updatedValue,
            description,
            card,
            verifyToken.id
        )

        await this.payableData.createPayable(payable)

        const message = {
            deposito: `O valor de R$:${updatedValue} foi transferido para a conta: ${searchCard.getLastNumber()}, titular: ${searchCard.getCardCustomerName()}`,
            total: `A sua conta agora possui o total de R$:${holderTotalAmount}`
        }
        return message
    }

    getAllPayableByUser = async (token: string) => {
        if (!token) {
            throw new Error("Token inexistente ou inválido.")
        }
        const verifyToken = this.tokenGeneratorUtils.getTokenData(token)
        if (!verifyToken) {
            throw new Error("Token inexistente ou inválido.")
        }

        const payable = await this.payableData.getAllPayableByCustomerId(verifyToken.id)
        if (!payable) {
            throw new Error("Nenhuma transação foi localizado")
        }

        return payable
    }

    getPayableByStatus = async (input: PayableStatusInputDto) => {
        const { token, status } = input

        if (!token) {
            throw new Error("Token inexistente ou inválido.")
        }

        if (!status) {
            throw new Error("Status inexistente ou inválido.")
        }

        const verifyToken = this.tokenGeneratorUtils.getTokenData(token)
        if (!verifyToken) {
            throw new Error("Token inexistente ou inválido.")
        }

        const payable = await this.payableData.getPayableByStatus(status)
        if (!payable) {
            throw new Error("Nenhuma transação foi localizado, verifique se o status esta correto.")
        }

        return payable
    }
}
