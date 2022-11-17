import CardRepositoryInterface from "../repositoryInterface/card/cardRepositoryInterface"
import Card from "../../model/card/card"
import HashManagerUtils from "../../utils/hashManagerUtils"
import IdGeneratorUtils from "../../utils/idGeneratorUtils"
import TokenGeneratorUtils from "../../utils/tokenGeneratorUtils"
import TransactionInputDTO from "../../model/transaction/transactionDto/transactionInputDTO"
import CypherCardNumberUtils from "../../utils/cypherCardNumberUtils"
import CardVerifyBodyRequest from "../../utils/validateInputs/cardVerifyBodyRequest"

export class CardBusiness {

    private cardData: CardRepositoryInterface
    private hashManagerUtils: HashManagerUtils
    private idGeneratorUtils: IdGeneratorUtils
    private tokenGeneratorUtils: TokenGeneratorUtils
    private cypherCardNumberUtils: CypherCardNumberUtils
    private cardVerifyBodyRequest: CardVerifyBodyRequest

    constructor(cardDate: CardRepositoryInterface) {
        this.cardData = cardDate
        this.hashManagerUtils = new HashManagerUtils()
        this.idGeneratorUtils = new IdGeneratorUtils()
        this.tokenGeneratorUtils = new TokenGeneratorUtils()
        this.cypherCardNumberUtils = new CypherCardNumberUtils()
        this.cardVerifyBodyRequest = new CardVerifyBodyRequest()
    }
    
    createCard = async (input: TransactionInputDTO) => {

        const { token, cardCustomerName, cardNumber, amount, cvv } = input

        this.cardVerifyBodyRequest.createCardVerifyBodyRequest(input)
        
        const verifyToken = this.tokenGeneratorUtils.getTokenData(token!)
        if (!verifyToken) {
            throw new Error("Token inválido")
        }
        await this.cardVerifyBodyRequest.searchExistingCardRequest(verifyToken.id, this.cardData)

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
