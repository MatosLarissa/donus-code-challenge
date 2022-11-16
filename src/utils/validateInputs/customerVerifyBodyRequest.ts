import CustomerRepositoryInterface from "../../business/repositoryInterface/customer/customerRepositoryInterface"
import AuthenticatorInterface from "../../model/authenticator/authenticatorInterface"
import signInInputDto from "../../model/customer/customerDto/signInInputDto"
import signUpInputDto from "../../model/customer/customerDto/signUpInputDto"
import HashManagerUtils from "../hashManagerUtils"
import IdGeneratorUtils from "../idGeneratorUtils"
import messageUtils from "../messageUtils"
import TokenGeneratorUtils from "../tokenGeneratorUtils"
import ValidateCpfUtils from "../validateCpfUtils"
import ValidateEmailUtils from "../validateEmailUtils"
import ValidatePasswordUtils from "../validatePasswordUtils"


export default class CustomerVerifyBodyRequest {

    private validateCpfUtils: ValidateCpfUtils
    private validateEmailUtils: ValidateEmailUtils
    private validatePasswordUtils: ValidatePasswordUtils
    private hashManagerUtils: HashManagerUtils
    private tokenGeneratorUtils: TokenGeneratorUtils
    private idGeneratorUtils: IdGeneratorUtils

    constructor() {
        this.validateCpfUtils = new ValidateCpfUtils()
        this.validateEmailUtils = new ValidateEmailUtils()
        this.validatePasswordUtils = new ValidatePasswordUtils()
        this.hashManagerUtils = new HashManagerUtils()
        this.tokenGeneratorUtils = new TokenGeneratorUtils()
        this.idGeneratorUtils = new IdGeneratorUtils()
    }

    createCustomerVerifyBodyRequest = (body: signInInputDto) => {
        const { fullName, cpf, email, password } = body

        if (!fullName) {
            throw messageUtils(400, "O nome completo não foi preenchido")
        }
        if (!cpf) {
            throw messageUtils(400, "O cpf não foi preenchido")
        }
        if (!email) {
            throw messageUtils(400, "O email não foi preenchido")
        }
        if (!password) {
            throw messageUtils(400, "O password não foi preenchido")
        }

        if (!fullName && !cpf && !email && !password) {
            throw messageUtils(400, "Nenhum campo foi preenchido")
        }

        if (this.validateCpfUtils.validateCpf(cpf) === false) {
            throw messageUtils(400, "Cpf invalido.")
        }

        if (this.validateEmailUtils.validateEmail(email) === false) {
            throw messageUtils(400, "Email invalido.")
        }
        if (this.validatePasswordUtils.validatePassword(password) === false) {
            throw messageUtils(400, "Senha invalido, precisa no mínimo 4 caracteres, pelo menos 1 letra e 1 número.")
        }
    }

    searchExistingCustomerRequest = async (email: string, cpf: string, repository: CustomerRepositoryInterface) => {
        const searchExistingCustomer = await repository.getCustomerByCpf(cpf)
        const searchExistingEmail = await repository.getCustomerByEmail(email)

        if (searchExistingCustomer) {
            throw messageUtils(400, "Este usuário já esta cadastrado.")
        }
        if (searchExistingEmail) {
            throw messageUtils(400, "Email invalido.")
        }
    }

    generateIdCustomerRequest = async (email: string) => {
        const id = this.idGeneratorUtils.generateId()
        const authenticator: AuthenticatorInterface = {
            id: id,
            email: email
        }
        const token = this.tokenGeneratorUtils.generateToken(authenticator)
        const result = {
            token: token,
            id: id,
        }
        return result
    }

    validateLoginCustomerRequest = async (body: signUpInputDto, repository: CustomerRepositoryInterface) => {
        const { email, password } = body

        const customer = await repository.getCustomerByEmail(email)
        if (!customer) {
            throw messageUtils(400, "O email que você inseriu não está conectado a uma conta")
        }

        const verifyPassword = await this.hashManagerUtils.compare(password, customer.getPassword())
        if (!verifyPassword) {
            throw messageUtils(400, "Senha inválida")
        }

        const token = this.tokenGeneratorUtils.generateToken({ id: customer!.getId(), email: customer.getEmail() })

        return token;
    }

    loginCustomerVerifyBodyRequest = (body: signUpInputDto) => {
        const { email, password } = body

        if (!email) {
            throw messageUtils(400, "O email não foi preenchido")
        }
        if (!password) {
            throw messageUtils(400, "O password não foi preenchido")
        }

        if (!email && !password) {
            throw messageUtils(400, "Nenhum campo foi preenchido")
        }

        if (this.validateEmailUtils.validateEmail(email) === false) {
            throw messageUtils(400, "Email invalido.")
        }
        if (this.validatePasswordUtils.validatePassword(password) === false) {
            throw messageUtils(400, "Senha invalido, precisa no mínimo 4 caracteres, pelo menos 1 letra e 1 número.")
        }
    }
}
