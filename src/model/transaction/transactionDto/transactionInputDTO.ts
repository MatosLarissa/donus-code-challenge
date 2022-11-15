type TransactionInputDTO = {
    token: string | undefined,
    cardholderName: string,
    cardNumber: string,
    cvv: string,
}

export default TransactionInputDTO;
