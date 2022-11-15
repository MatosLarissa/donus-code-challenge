import Card from "../../../model/card/card"

export default interface CardRepositoryInterface {
    createCard(card: Card): Promise<void>
    getAllTransactionByCustomerId(idCustomer: string): Promise<Card | null>
}
