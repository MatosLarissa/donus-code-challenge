import Customer from "../../../model/customer/customer";

export default interface CustomerRepositoryInterface {
    createCustomer(Customer: Customer): Promise<void>
    getCustomerByCpf(cpf: string): Promise<Customer | null>
    getCustomerByEmail(email: string): Promise<Customer | null>
}
