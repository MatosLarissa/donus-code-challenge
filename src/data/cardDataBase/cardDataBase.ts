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

    getAllTransactionByCustomerId = async (idCustomer: string) => {
        try {
            const queryResult: any = await CardDataBase
                .connection(this.TABLE_CARD)
                .select()
                .where({ idCustomer })
            if (queryResult[0]) {
                const result = new Card(
                    queryResult[0].id,
                    queryResult[0].cardCustomerName,
                    queryResult[0].cardNumber,
                    queryResult[0].lastNumber,
                    queryResult[0].cvv,
                    queryResult[0].idCustomer
                )
                return result
            } else {
                return null
            }
        } catch (error: any) {
            throw new Error(error.message || error.sqlMessage)
        }
    }
}