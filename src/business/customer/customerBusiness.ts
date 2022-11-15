import AuthenticatorInterface from "../../model/authenticator/authenticatorInterface";

import Customer from "../../model/customer/customer";
import signInInputDto from "../../model/customer/customerDto/signInInputDto";
import HashManagerUtils from "../../utils/hashManagerUtils";
import IdGeneratorUtils from "../../utils/idGeneratorUtils";
import TokenGeneratorUtils from "../../utils/tokenGeneratorUtils";
import ValidateCpfUtils from "../../utils/validateCpfUtils";
import ValidateEmailUtils from "../../utils/validateEmailUtils";
import ValidatePasswordUtils from "../../utils/validatePasswordUtils";

import CustomerRepositoryInterface from "../repositoryInterface/customer/customerRepositoryInterface";

ValidatePasswordUtils

class CustomerBusiness {

    private customerData: CustomerRepositoryInterface
    private hashManagerUtils: HashManagerUtils
    private idGeneratorUtils: IdGeneratorUtils
    private tokenGeneratorUtils: TokenGeneratorUtils
    private validateCpfUtils: ValidateCpfUtils
    private validateEmailUtils: ValidateEmailUtils
    private validatePasswordUtils: ValidatePasswordUtils

    constructor(customerDataImplementation: CustomerRepositoryInterface) {
        this.customerData = customerDataImplementation
        this.hashManagerUtils = new HashManagerUtils()
        this.idGeneratorUtils = new IdGeneratorUtils()
        this.tokenGeneratorUtils = new TokenGeneratorUtils()
        this.validateCpfUtils = new ValidateCpfUtils()
        this.validateEmailUtils = new ValidateEmailUtils()
        this.validatePasswordUtils = new ValidatePasswordUtils()


    }
    createCustomer = async (input: signInInputDto) => {
        const { fullName, cpf, email, password } = input

        if (!fullName || !cpf || !email || !password) {
            throw new Error("Algum campo não foi preenchido")
        }
        if (this.validateCpfUtils.validateCpf(cpf) === false) {
            throw new Error("Cpf invalido.")
        }
        if (this.validateEmailUtils.validateEmail(email) === false) {
            throw new Error("Email invalido.")
        }
        if (this.validatePasswordUtils.validatePassword(password) === false) {
            throw new Error("Senha invalido, precisa no mínimo 4 caracteres, pelo menos 1 letra e 1 número.")
        }

        const searchExistingCustomer = await this.customerData.getCustomerByCpf(cpf)
        const searchExistingEmail = await this.customerData.getCustomerByEmail(email)

        if (searchExistingCustomer) {
            throw new Error("Este usuário já esta cadastrado.")
        }
        if (searchExistingEmail) {
            throw new Error("Email invalido.")
        }

        const id = this.idGeneratorUtils.generateId()

        const cypherPassword = await this.hashManagerUtils.hash(password)

        const dateCreated = new Date()

        const customer = new Customer(
            id,
            fullName,
            cpf,
            email,
            cypherPassword,
            dateCreated
        )
        await this.customerData.createCustomer(customer)

        const authenticator: AuthenticatorInterface = {
            id: id,
            email: email
        }

        const token = this.tokenGeneratorUtils.generateToken(authenticator)

        return token
    }

}

export default CustomerBusiness;         