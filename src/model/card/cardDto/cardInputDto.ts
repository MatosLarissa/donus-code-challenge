type CardInputDTO = {
    token: string | undefined,
    cardCustomerName: string,
    cardNumber: string,
    cvv: string,
    amount: number
}

export default CardInputDTO;
