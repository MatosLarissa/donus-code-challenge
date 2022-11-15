import Card from "../../../model/card/card"

export default interface CardRepository {
    createCard(card: Card): Promise<void>
    getAllTransactionByCustomerId(idCustomer: string): Promise<Card | null>
}