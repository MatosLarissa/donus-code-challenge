import Card from "../../../model/card/card"
import Payable from "../../../model/playable/payable"

export default interface PayableRepositoryInterface {
    createPayable(payable: Payable): Promise<void>
    getHolderCard(id: string): Promise<Card| null>
    getAllPayableByHolderId(id: string): Promise<Payable | null>
}