import PayableRepositoryInterface from "../repositoryInterface/payable/payableRepositoryInterface";
import HashManagerUtils from "../../utils/hashManagerUtils";
import IdGeneratorUtils from "../../utils/idGeneratorUtils";
import TokenGeneratorUtils from "../../utils/tokenGeneratorUtils";
import PayableInputDTO from "../../model/playable/playableDto/payableInputDto";
import paymentStatus from "../../model/enums/paymentStatus";
import Payable from "../../model/playable/payable";
import moment from "moment";

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

    createPayable = async (input: PayableInputDTO) => {
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

        const checkCardHolder = await this.payableData.getCustomerCard(verifyToken.id)

        const verifyCard = await this.hashManagerUtils.compare(cardNumber, checkCardHolder!.getCardNumber())
        if (!verifyCard) {
            throw new Error("Verifique o número do cartão")
        }

        const verifyCvv = await this.hashManagerUtils.compare(cvv, checkCardHolder!.getCvv())
        if (!verifyCvv) {
            throw new Error("Verifique o número do cvv")
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

        const id = this.idGeneratorUtils.generateId()

        const dateCreated = new Date()

        const payable = new Payable(
            id,
            status,
            paymentDate,
            dateCreated,
            updatedValue,
            description,
            verifyToken.id
        )

        await this.payableData.createPayable(payable)

        return payable
    }

    getAllPayableByUser = async (token: string | undefined) => {
        if (!token) {
            throw new Error("Token inexistente ou inválido.")
        }

        const verifyToken = this.tokenGeneratorUtils.getTokenData(token)
        if (!verifyToken) {
            throw new Error("Token inexistente ou inválido.")
        }

        const payable = await this.payableData.getAllPayableByCustomerId(verifyToken.id)

        return payable
    }
}