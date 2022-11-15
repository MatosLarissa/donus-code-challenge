export default class Card {
    constructor(
        private id: string,
        private cardCustomerName: string,
        private cardNumber: string,
        private lastNumber: string,
        private cvv: string,
        private idCustomer: string
    ) { }

    getId() {
        return this.id
    }
    getCardCustomerName() {
        return this.cardCustomerName
    }
    getCardNumber() {
        return this.cardNumber
    }
    getLastNumber() {
        return this.lastNumber
    }
    getCvv() {
        return this.cvv
    }
    getIdCustomer() {
        return this.idCustomer
    }

    setId(id: string) {
        this.id = id
    }
    setCardNumber(cardNumber: string) {
        this.cardNumber = cardNumber
    }
    setLastNumber(lastNumber: string) {
        this.lastNumber = lastNumber
    }
    setCardCustomerName(cardCustomerName: string) {
        this.cardCustomerName = cardCustomerName
    }
    setCvv(cvv: string) {
        this.cvv = cvv
    }
    setIdCustomer(idCustomer: string) {
        this.idCustomer = idCustomer
    }




}