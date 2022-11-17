import CardRepositoryInterface from "../../business/repositoryInterface/card/cardRepositoryInterface"
import TransactionInputDTO from "../../model/transaction/transactionDto/transactionInputDTO"
import messageUtils from "../messageUtils"

export default class CardVerifyBodyRequest {

    createCardVerifyBodyRequest = (body: TransactionInputDTO) => {
        const { token, cardCustomerName, cardNumber, amount, cvv } = body

        if (!token) {
            throw messageUtils(400, "Token inválido")
        }
        if (!cardCustomerName) {
            throw messageUtils(400, "O Nome do cartão não foi preenchido")
        }
        if (!cardNumber) {
            throw messageUtils(400, "O número do cartão não foi preenchido")
        }
        if (!cvv) {
            throw messageUtils(400, "O número do cvv não foi preenchido")
        }
        if (amount > 2000) {
            throw messageUtils(400, "Por questão de segurança cada transação de depósito não pode ser maior do que R$2.000")
        }
        if (amount < 0) {
            throw messageUtils(400, "Não é possível inserir um valor negativo")
        }

        if (!cardCustomerName && !cardNumber && !amount && !cvv) {
            throw messageUtils(400, "Nenhum campo foi preenchido")
        }
    }

    searchExistingCardRequest = async (id: string, repository: CardRepositoryInterface) => {
        const searchExistingCustomer = await repository.getAllCardByCustomerId(id)

        if (searchExistingCustomer) {
            throw messageUtils(400, "Este cliente ja possui um cartão.")
        }
    }
}
