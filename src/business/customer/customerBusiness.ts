import AuthenticatorInterface from "../../model/authenticator/authenticatorInterface";
import Customer from "../../model/customer/customer";
import signInInputDto from "../../model/customer/customerDto/signInInputDto";
import signUpInputDto from "../../model/customer/customerDto/signUpInputDto";
import HashManagerUtils from "../../utils/hashManagerUtils";
import IdGeneratorUtils from "../../utils/idGeneratorUtils";
import TokenGeneratorUtils from "../../utils/tokenGeneratorUtils";
import ValidateCpfUtils from "../../utils/validateCpfUtils";
import ValidateEmailUtils from "../../utils/validateEmailUtils";
import CustomerVerifyBodyRequest from "../../utils/validateInputs/customerVerifyBodyRequest";
import ValidatePasswordUtils from "../../utils/validatePasswordUtils";
import CustomerRepositoryInterface from "../repositoryInterface/customer/customerRepositoryInterface";

class CustomerBusiness {

    private customerData: CustomerRepositoryInterface
    private hashManagerUtils: HashManagerUtils
    private customerVerifyBodyRequest: CustomerVerifyBodyRequest

    constructor(customerDataImplementation: CustomerRepositoryInterface) {
        this.customerData = customerDataImplementation
        this.hashManagerUtils = new HashManagerUtils()
        this.customerVerifyBodyRequest = new CustomerVerifyBodyRequest()
    }

    createCustomer = async (input: signInInputDto) => {
        const { fullName, cpf, email, password } = input

        this.customerVerifyBodyRequest.createCustomerVerifyBodyRequest(input)

        await this.customerVerifyBodyRequest.searchExistingCustomerRequest(email, cpf, this.customerData)

        const cypherPassword = await this.hashManagerUtils.hash(password)

        const dateCreated = new Date()

        const token = await this.customerVerifyBodyRequest.generateIdCustomerRequest(email)

        const customer = new Customer(
            token.id,
            fullName,
            cpf,
            email,
            cypherPassword,
            dateCreated
        )

        await this.customerData.createCustomer(customer)

        return token.token
    }

    login = async (input: signUpInputDto) => {

        this.customerVerifyBodyRequest.loginCustomerVerifyBodyRequest(input)
        const token = await this.customerVerifyBodyRequest.validateLoginCustomerRequest(input, this.customerData)

        return token
    }
}

export default CustomerBusiness;
