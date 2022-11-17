import moment from "moment"
import PayableRepositoryInterface from "../../business/repositoryInterface/payable/payableRepositoryInterface"
import AuthenticatorInterface from "../../model/authenticator/authenticatorInterface"
import paymentStatus from "../../model/enums/paymentStatus"
import PayableInputDTO from "../../model/playable/playableDto/payableInputDto"
import TransferPayableInputDto from "../../model/playable/playableDto/transferPayableInputDto"
import HashManagerUtils from "../hashManagerUtils"
import IdGeneratorUtils from "../idGeneratorUtils"
import messageUtils from "../messageUtils"
import TokenGeneratorUtils from "../tokenGeneratorUtils"

export default class PayableVerifyBodyRequest {
    private hashManagerUtils: HashManagerUtils
    private tokenGeneratorUtils: TokenGeneratorUtils
    private idGeneratorUtils: IdGeneratorUtils

    constructor() {
        this.hashManagerUtils = new HashManagerUtils()
        this.tokenGeneratorUtils = new TokenGeneratorUtils()
        this.idGeneratorUtils = new IdGeneratorUtils()
    }

    createPayableVerifyBodyRequest = (body: PayableInputDTO) => {
        const { token, paymentMethod, value, description, cardNumber, cvv } = body

        if (!token) {
            throw messageUtils(400, "Token inválido")
        }
        if (!paymentMethod) {
            throw messageUtils(400, "Metodo de pagamento invalido, escolha DEBIT_CARD ou CREDIT_CARD")
        }
        if (!value) {
            throw messageUtils(400, "O valor não foi preenchido")
        }
        if (value > 2000) {
            throw messageUtils(400,"Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000")
        }
        if (value < 0) {
            throw messageUtils(400,"Não é possível inserir um valor negativo")
        }
        if (!description) {
            throw messageUtils(400, "A descrição não foi preenchida")
        }
        if (!cardNumber) {
            throw messageUtils(400, "O número do cartão não foi preenchida")
        }
        if (!cvv) {
            throw messageUtils(400, "O número do cvv não foi preenchida")
        }
        if (!paymentMethod && !value && !description && !cardNumber && !cvv) {
            throw messageUtils(400, "Nenhum campo foi preenchido")
        }
    }

    transferPayableVerifyBodyRequest = (body: TransferPayableInputDto) => {
        const { token, paymentMethod, value, description, cardNumber, cvv, idTransferCustomer } = body

        if (!token) {
            throw messageUtils(400, "Token inválido")
        }
        if (!paymentMethod) {
            throw messageUtils(400, "Metodo de pagamento invalido, escolha DEBIT_CARD ou CREDIT_CARD")
        }
        if (!value) {
            throw messageUtils(400, "O valor não foi preenchido")
        }
        if (value > 2000) {
            throw messageUtils(400,"Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000")
        }
        if (value < 0) {
            throw messageUtils(400,"Não é possível inserir um valor negativo")
        }
        if (!description) {
            throw messageUtils(400, "A descrição não foi preenchida")
        }
        if (!cardNumber) {
            throw messageUtils(400, "O número do cartão não foi preenchida")
        }
        if (!cvv) {
            throw messageUtils(400, "O número do cvv não foi preenchida")
        }
        if (!idTransferCustomer) {
            throw messageUtils(400, "O id do destinatário não foi preenchida")
        }
        if (!paymentMethod && !value && !description && !cardNumber && !cvv && !idTransferCustomer) {
            throw messageUtils(400, "Nenhum campo foi preenchido")
        }
    }

    searchExistingCardRequest = async (id: string, cardNumber: string, cvv: string, repository: PayableRepositoryInterface) => {
        const checkCardCustomer = await repository.getCustomerCard(id)

        const verifyCard = await this.hashManagerUtils.compare(cardNumber, checkCardCustomer!.getCardNumber())

        if (!verifyCard) {
            throw messageUtils(400, "Verifique o número do seu cartão")
        }

        const verifyCvv = await this.hashManagerUtils.compare(cvv, checkCardCustomer!.getCvv())
        if (!verifyCvv) {
            throw messageUtils(400, "Verifique o número do seu do cvv")
        }

        const cardLastNumber = checkCardCustomer!.getLastNumber()
        return cardLastNumber
    }

    updateDepositPayableRequest = async (id:string, paymentMethod: string, value: number, repository: PayableRepositoryInterface) => {
        let depositAmounts = 0
        let holderTotalAmount = 0
        let someAccountValue = 0

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

        const checkCardCustomer = await repository.getCustomerCard(id)

        depositAmounts += value
        holderTotalAmount = checkCardCustomer!.getAmount()
        someAccountValue = holderTotalAmount + updatedValue

        await repository.updateAmountCard(checkCardCustomer!.getIdCustomer(), someAccountValue)
        
        const result = {
            status: status,
            paymentDate: paymentDate,
            updatedValue: updatedValue,
            someAccountValue: someAccountValue
        }
        return result
    }

    updateTransferPayableRequest = async (id:string, paymentMethod: string, value: number, idTransferCustomer: string, repository: PayableRepositoryInterface) => {
        let transferAmounts = 0
        let holderTotalAmount = 0
        let recipientWallet = 0
        let subtractAccountValue = 0

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

        const checkCardCustomer = await repository.getCustomerCard(id)
        const searchCard = await repository.getCustomerCard(idTransferCustomer)
        if (!searchCard) {
            throw messageUtils(400, "O Receptor não foi localizado")
        }

        if (value > 2000) {
            throw messageUtils(400, "Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000")
        }
        if (value < 0) {
            throw messageUtils(400, "Não é possível inserir um valor negativo")
        }

        transferAmounts += value
        holderTotalAmount = checkCardCustomer!.getAmount()
        if (transferAmounts > holderTotalAmount) {
            throw messageUtils(400, `O valor da transferência é maior que o saldo da sua conta. O seu saldo atual é de R$:${checkCardCustomer!.getAmount()} `)
        } else {
            subtractAccountValue = holderTotalAmount - transferAmounts
            await repository.updateAmountCard(checkCardCustomer!.getIdCustomer(), subtractAccountValue)
            recipientWallet += searchCard!.getAmount()
            const someValue = recipientWallet + updatedValue
            await repository.updateAmountCard(searchCard!.getIdCustomer(), someValue)
        }
        
        const result = {
            status: status,
            paymentDate: paymentDate,
            updatedValue: updatedValue,
            holderTotalAmount: subtractAccountValue,
            lastNumberCard: searchCard.getLastNumber(),
            nameTitularTransfer: searchCard.getCardCustomerName()
            
        }
        return result
    }

    generateIdPayableRequest = async (email: string) => {
        const id = this.idGeneratorUtils.generateId()
        const authenticator: AuthenticatorInterface = {
            id: id,
            email: email
        }
        const token = this.tokenGeneratorUtils.generateToken(authenticator)
        const result = {
            token: token,
            id: id,
        }
        return result
    }
}
