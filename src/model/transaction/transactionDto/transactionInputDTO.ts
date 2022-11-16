type TransactionInputDTO = {
    token?: string,
    cardCustomerName: string,
    cardNumber: string,
    cvv: string,
    amount: number,

}

export default TransactionInputDTO;
