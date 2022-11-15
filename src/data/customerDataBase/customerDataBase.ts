import CustomerRepositoryInterface from "../../business/repositoryInterface/customer/customerRepositoryInterface"
import Customer from "../../model/customer/customer"
import BaseDataBase from "../baseDataBase/baseDataBase"

export default class CustomerDataBase extends BaseDataBase implements CustomerRepositoryInterface {

    private TABLE_NAME = "customer"

    createCustomer = async (customer: Customer) => {
        try {
            await CustomerDataBase
                .connection(this.TABLE_NAME)
                .insert({
                    "id": customer.getId(),
                    "fullName": customer.getFullName(),
                    "cpf": customer.getCpf(),
                    "email": customer.getEmail(),
                    "password": customer.getPassword(),
                    "created": customer.getCreated()
                })
        } catch (error: any) {
            throw new Error(error.message || error.sqlMessage)
        }
    }

    getCustomerByCpf = async (cpf: string) => {
        try {
            const result: Customer[] = await CustomerDataBase
                .connection(this.TABLE_NAME)
                .select()
                .where({ cpf })
            return result.length ? result[0] : null
        } catch (error: any) {
            throw new Error(error.message || error.sqlMessage)
        }
    }

    getCustomerByEmail = async (email: string) => {
        try {
            const queryResult: any = await CustomerDataBase
                .connection(this.TABLE_NAME)
                .select()
                .where({ email })
            if (queryResult[0]) {
                const result = new Customer(
                    queryResult[0].id,
                    queryResult[0].fullName,
                    queryResult[0].cpf,
                    queryResult[0].email,
                    queryResult[0].password,
                    queryResult[0].created
                )
                return result
            } else {
                return null
            }
        } catch (error: any) {
            throw new Error(error.message || error.sqlMessage)
        }
    }
}
