import PayableRepositoryInterface from "../repositoryInterface/payable/payableRepositoryInterface";
import IdGeneratorUtils from "../../utils/idGeneratorUtils";
import TokenGeneratorUtils from "../../utils/tokenGeneratorUtils";
import PayableInputDTO from "../../model/playable/playableDto/payableInputDto";
import Payable from "../../model/playable/payable";
import PayableStatusInputDto from "../../model/playable/playableDto/payableStatusInputDto";
import TransferPayableInputDto from "../../model/playable/playableDto/transferPayableInputDto";
import PayableVerifyBodyRequest from "../../utils/validateInputs/payableVerifyBodyRequest";

export default class PayableBusiness {

    private payableData: PayableRepositoryInterface
    private idGeneratorUtils: IdGeneratorUtils
    private tokenGeneratorUtils: TokenGeneratorUtils
    private payableVerifyBodyRequest: PayableVerifyBodyRequest

    constructor(payableDataImplementation: PayableRepositoryInterface) {
        this.payableData = payableDataImplementation
        this.idGeneratorUtils = new IdGeneratorUtils()
        this.tokenGeneratorUtils = new TokenGeneratorUtils()
        this.payableVerifyBodyRequest = new PayableVerifyBodyRequest()
    }

    depositPayable = async (input: PayableInputDTO) => {

        const { token, paymentMethod, value, description, cardNumber, cvv } = input

        this.payableVerifyBodyRequest.createPayableVerifyBodyRequest(input)

        const verifyToken = this.tokenGeneratorUtils.getTokenData(token!)
        if (!verifyToken) {
            throw new Error("Token inexistente ou inválido.")
        }

        const cardLastNumber = await this.payableVerifyBodyRequest.searchExistingCardRequest(verifyToken.id, cardNumber, cvv, this.payableData)
        const updatePayable = await this.payableVerifyBodyRequest.updateDepositPayableRequest(verifyToken.id, paymentMethod, value, this.payableData)

        const id = this.idGeneratorUtils.generateId()
        const dateCreated = new Date()

        const payable = new Payable(
            id,
            updatePayable.status,
            updatePayable.paymentDate,
            dateCreated,
            updatePayable.updatedValue,
            description,
            cardLastNumber,
            verifyToken.id
        )

        await this.payableData.createPayable(payable)

        const message = {
            deposito: `O valor de R$:${updatePayable.updatedValue} foi depositado na sua conta`,
            total: `A sua conta agora possui o total de R$:${updatePayable.someAccountValue}`
        }

        return message
    }

    transferPayable = async (input: TransferPayableInputDto) => {

        const { token, paymentMethod, value, description, cardNumber, cvv, idTransferCustomer } = input

        this.payableVerifyBodyRequest.transferPayableVerifyBodyRequest(input)

        const verifyToken = this.tokenGeneratorUtils.getTokenData(token!)
        if (!verifyToken) {
            throw new Error("Token inexistente ou inválido.")
        }

        const cardLastNumber = await this.payableVerifyBodyRequest.searchExistingCardRequest(verifyToken.id, cardNumber, cvv, this.payableData)
        const updatePayable = await this.payableVerifyBodyRequest.updateTransferPayableRequest(verifyToken.id, paymentMethod, value, idTransferCustomer, this.payableData)

        const id = this.idGeneratorUtils.generateId()
        const dateCreated = new Date()

        const payable = new Payable(
            id,
            updatePayable.status,
            updatePayable.paymentDate,
            dateCreated,
            updatePayable.updatedValue,
            description,
            cardLastNumber,
            verifyToken.id
        )

        await this.payableData.createPayable(payable)

        const message = {
            deposito: `O valor de R$:${updatePayable.updatedValue} foi transferido para a conta: ${updatePayable.lastNumberCard}, titular: ${updatePayable.nameTitularTransfer}`,
            total: `A sua conta agora possui o total de R$:${updatePayable.holderTotalAmount}`
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
