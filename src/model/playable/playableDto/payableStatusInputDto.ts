import paymentStatus from "../../enums/paymentStatus";

type PayableStatusInputDto = {
    token: string | undefined,
    status: paymentStatus
}

export default PayableStatusInputDto;
