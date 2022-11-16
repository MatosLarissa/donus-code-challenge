export default class Card {
    constructor(
        private id: string,
        private cardCustomerName: string,
        private cardNumber: string,
        private lastNumber: string,
        private cvv: string,
        private amount: number,
        private idCustomer: string
    ) { }

    static toCardModel(card: any): Card {
        return new Card(card.id, card.cardCustomerName, card.cardNumber, card.lastNumber, card.cvv, card.amount, card.idCustomer);
    }

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
    getAmount() {
        return this.amount
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
    setAmount(amount: number) {
        this.amount = amount
    }
    setIdCustomer(idCustomer: string) {
        this.idCustomer = idCustomer
    }
}
