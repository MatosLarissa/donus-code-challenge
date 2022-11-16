import CardRepositoryInterface from "../repositoryInterface/card/cardRepositoryInterface"
import Card from "../../model/card/card"
import HashManagerUtils from "../../utils/hashManagerUtils"
import IdGeneratorUtils from "../../utils/idGeneratorUtils"
import TokenGeneratorUtils from "../../utils/tokenGeneratorUtils"
import TransactionInputDTO from "../../model/transaction/transactionDto/transactionInputDTO"
import CypherCardNumberUtils from "../../utils/cypherCardNumberUtils"

export class CardBusiness {

    private cardData: CardRepositoryInterface
    private hashManagerUtils: HashManagerUtils
    private idGeneratorUtils: IdGeneratorUtils
    private tokenGeneratorUtils: TokenGeneratorUtils
    private cypherCardNumberUtils: CypherCardNumberUtils

    constructor(cardDate: CardRepositoryInterface) {
        this.cardData = cardDate
        this.hashManagerUtils = new HashManagerUtils()
        this.idGeneratorUtils = new IdGeneratorUtils()
        this.tokenGeneratorUtils = new TokenGeneratorUtils()
        this.cypherCardNumberUtils = new CypherCardNumberUtils()

    }
    
    createCard = async (input: TransactionInputDTO) => {

        const {
            token,
            cardCustomerName,
            cardNumber,
            amount,
            cvv
        } = input

        if (
            !token ||
            !cardCustomerName ||
            !cardNumber ||
            !cvv
        ) {
            throw new Error("Algum campo não foi preenchido")
        }

        const verifyToken = this.tokenGeneratorUtils.getTokenData(token)
        if (!verifyToken) {
            throw new Error("Token inválido")
        }

        const findAllCard = await this.cardData.getAllTransactionByCustomerId(verifyToken.id)
        if (findAllCard) {
            throw new Error("Este cliente ja possui um cartão.")
        }

        if (amount > 2000) {
            throw new Error("Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000")
        }
        if (amount < 0) {
            throw new Error("Não é possível inserir um valor negativo")
        }

        const id = this.idGeneratorUtils.generateId()
        const cypherCard = await this.cypherCardNumberUtils.cypherNumber(cardNumber)
        const hashCard = await this.hashManagerUtils.hash(cardNumber)
        const hashCvv = await this.hashManagerUtils.hash(cvv)

        const transaction = new Card(
            id,
            cardCustomerName,
            hashCard,
            cypherCard,
            hashCvv,
            amount,
            verifyToken.id
        )
        await this.cardData.createCard(transaction)

        return transaction
    }

    getAllCardByCustomerId = async (token: string) => {
        if (!token) {
            throw new Error("Token inexistente ou inválido.")
        }

        const verifyToken = this.tokenGeneratorUtils.getTokenData(token)
        if (!verifyToken) {
            throw new Error("Token inexistente ou inválido.")
        }

        const findAllCard = await this.cardData.getAllCardByCustomerId(verifyToken.id)
        if (!findAllCard) {
            throw new Error("Nenhum cartão localizado")
        }

        return findAllCard
    }
}
