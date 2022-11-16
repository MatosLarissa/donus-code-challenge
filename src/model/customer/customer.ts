export default class Customer {
    constructor(
        private id: string,
        private fullName: string,
        private cpf: string,
        private email: string,
        private password: string,
        private created: Date

    ) { }

    getId() {
        return this.id;
    }
    getFullName() {
        return this.fullName;
    }
    getCpf() {
        return this.cpf;
    }
    getEmail() {
        return this.email
    }
    getPassword() {
        return this.password
    }
    getCreated() {
        return this.created
    }

    setFullName(fullName: string) {
        this.fullName = fullName;
    }
    setCpf(cpf: string) {
        this.cpf = cpf;
    }
    setEmail(email: string) {
        this.email = email;
    }
    setPassword(password: string) {
        this.password = password;
    }
    setCreated(created: Date) {
        return this.created = created;
    }

    static toUserModel(customer: any): Customer {
        return new Customer(customer.id, customer.fullName, customer.cpf, customer.email, customer.password, customer.created);
    }
}
