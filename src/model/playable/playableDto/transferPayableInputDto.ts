import paymentMethod from "../../enums/paymentMethod";

type TransferPayableInputDto = {
    token: string | undefined,
    paymentMethod: paymentMethod,
    value: number,
    description: string,
    cardNumber: string,
    cvv: string,
    idTransferCustomer: string,
}

export default TransferPayableInputDto;
