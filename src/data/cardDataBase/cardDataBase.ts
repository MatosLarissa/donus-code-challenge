import CardRepositoryInterface from "../../business/repositoryInterface/card/cardRepositoryInterface"
import Card from "../../model/card/card"
import BaseDataBase from "../baseDataBase/baseDataBase"


export default class CardDataBase extends BaseDataBase implements CardRepositoryInterface {

    private TABLE_CARD = "card"

    createCard = async (card: Card): Promise<void> => {
        try {
            await CardDataBase
                .connection(this.TABLE_CARD)
                .insert({
                    "id": card.getId(),
                    "cardCustomerName": card.getCardCustomerName(),
                    "cardNumber": card.getCardNumber(),
                    "lastNumber": card.getLastNumber(),
                    "cvv": card.getCvv(),
                    "idCustomer": card.getIdCustomer()
                })
        } catch (error: any) {
            throw new Error(error.message || error.sqlMessage)
        }
    }
}