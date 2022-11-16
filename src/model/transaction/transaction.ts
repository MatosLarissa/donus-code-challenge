import paymentMethod from "../enums/paymentMethod";

export default class Transaction {
    constructor(
        private id: string,
        private cardNumber: string,
        private cvv: string,
        private idCustomer: string,
        private paymentMethod: paymentMethod
    ) { }

    getId() {
        return this.id
    }
    getCardNumber() {
        return this.cardNumber
    }
    getCvv() {
        return this.cvv
    }
    getIdCustomer() {
        return this.idCustomer
    }
    getPaymentMethod() {
        return this.paymentMethod
    }

    setId(id: string) {
        this.id = id
    }
    setCardNumber(cardNumber: string) {
        this.cardNumber = cardNumber
    }
    setCvv(cvv: string) {
        this.cvv = cvv
    }
    setIdCustomer(idCustomer: string) {
        this.idCustomer = idCustomer
    }
    setPaymentMethod(paymentMethod: paymentMethod) {
        this.paymentMethod = paymentMethod
    }
}
