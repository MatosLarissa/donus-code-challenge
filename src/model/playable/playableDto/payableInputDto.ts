import paymentMethod from "../../enums/paymentMethod";

type PayableInputDTO = {
    token: string | undefined,
    paymentMethod: paymentMethod,
    value: number,
    description: string,
    cardNumber: string,
    cvv: string,
}

export default PayableInputDTO;
