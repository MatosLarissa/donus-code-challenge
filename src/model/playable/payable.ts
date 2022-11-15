import paymentStatus from "../enums/paymentStatus"

export default class Payable {
    constructor(
        private id: string,
        private status: paymentStatus,
        private paymentDate: string,
        private createdDate: Date,
        private value: number,
        private description: string,
        private idCustomer: string

    ) { }
    static toPayableModel(customer: any): Payable {
        return new Payable(customer.id, customer.status, customer.paymentDate, customer.createdDate, customer.amount, customer.description, customer.idCustomer)
    }

    getId() {
        return this.id
    }
    getStatus() {
        return this.status
    }
    getPaymentDate() {
        return this.paymentDate
    }
    getCreatedDate() {
        return this.createdDate
    }
    getValue() {
        return this.value
    }
    getDescription() {
        return this.description
    }
    getIdCustomer() {
        return this.idCustomer
    }

    setId(id: string) {
        this.id = id
    }
    setStatus(status: paymentStatus) {
        this.status = status
    }
    setPaymentDate(paymentDate: string) {
        this.paymentDate = paymentDate
    }
    setCreatedDate(createdDate: Date) {
        this.createdDate = createdDate
    }
    setValue(value: number) {
        this.value = value
    }
    setDescription(description: string) {
        this.description = description
    }
    setIdCustomer(idCustomer: string) {
        this.idCustomer = idCustomer
    }

}