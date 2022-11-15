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

        const tokenData = this.tokenGeneratorUtils.getTokenData(token)
        if (!tokenData) {
            throw new Error("Token inválido")
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
            tokenData.id
        )
        await this.cardData.createCard(transaction)

        return transaction
    }
}