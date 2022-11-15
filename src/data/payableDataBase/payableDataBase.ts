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
                    "value": payable.getValue(),
                    "description": payable.getDescription(),
                    "idCustomer": payable.getIdCustomer()
                })
        } catch (error: any) {
            throw new Error(error.message || error.sqlMessage)
        }
    }
}