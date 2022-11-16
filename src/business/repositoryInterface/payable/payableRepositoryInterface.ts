import Card from "../../../model/card/card"
import Payable from "../../../model/playable/payable"

export default interface PayableRepositoryInterface {
    createPayable(payable: Payable): Promise<void>
    getCustomerCard(id: string): Promise<Card| null>
    getAllPayableByCustomerId(id: string): Promise<Payable | null>
    getPayableByStatus(id: string): Promise<Payable | null>
    updateAmountCard(id: string, amount: number): Promise<Card>
}
