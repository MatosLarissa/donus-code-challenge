import PayableRepositoryInterface from "../../business/repositoryInterface/payable/payableRepositoryInterface"
import Card from "../../model/card/card"
import Payable from "../../model/playable/payable"
import BaseDataBase from "../baseDataBase/baseDataBase"


export default class PayableDataBase extends BaseDataBase implements PayableRepositoryInterface {
    private TABLE_PAYABLE = "payable"
    private TABLE_CARD = "card"

    createPayable = async (payable: Payable): Promise<void> => {
        try {
            await PayableDataBase
                .connection(this.TABLE_PAYABLE)
                .insert({
                    "id": payable.getId(),
                    "status": payable.getStatus(),
                    "paymentDate": payable.getPaymentDate(),
                    "createdDate": payable.getCreatedDate(),
                    "amount": payable.getValue(),
                    "cardNumber": payable.getCardNumber(),
                    "description": payable.getDescription(),
                    "idCustomer": payable.getIdCustomer()
                })
        } catch (error: any) {
            throw new Error(error.message || error.sqlMessage)
        }
    }

    getAllPayableByCustomerId = async (id: string) => {
        try {
            const queryResult: any = await PayableDataBase
                .connection(this.TABLE_PAYABLE)
                .select(
                    "description",
                    "amount",
                    "status",
                    "paymentDate",
                    "cardNumber"
                )
                .where({ idCustomer: id })
            if (queryResult.length > 0) {
                return queryResult

            } else {
                return null
            }
        } catch (error: any) {
            throw new Error(error.message || error.sqlMessage)
        }
    }

    getPayableByStatus = async (status: string) => {
        try {
            const queryResult: any = await PayableDataBase
                .connection(this.TABLE_PAYABLE)
                .select(
                    "description",
                    "amount",
                    "status",
                    "paymentDate",
                    "cardNumber"
                )
                .where({ status: status })
            if (queryResult.length > 0) {
                return queryResult

            } else {
                return null
            }
        } catch (error: any) {
            throw new Error(error.message || error.sqlMessage)
        }
    }

    getCustomerCard = async (id: string) => {
        try {
            const queryResult: any = await PayableDataBase
                .connection(this.TABLE_CARD)
                .select()
                .where({ idCustomer: id })
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