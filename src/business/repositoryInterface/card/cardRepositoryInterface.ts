import Card from "../../../model/card/card"

export interface CardRepository {
    createCard(card: Card): Promise<void>
    getAllTransactionByCustomerId(idCustomer: string): Promise<Card | null>
}