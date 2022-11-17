import { createCustomerBody, createCustomerBodyErrorCpf } from "../mockData/mockData";
import CustomerVerifyBodyRequest from "../../utils/validateInputs/customerVerifyBodyRequest";
const customerVerify = new CustomerVerifyBodyRequest

describe("Testando services do Customer", () => {
  it("Verifica se existe o usuário passando dados corretos", async () => {
    

    expect(customerVerify.createCustomerVerifyBodyRequest(createCustomerBody)).toBe(undefined);
  });
  it("Verifica se retorna erro ao passar body errado", () => {
    try {
      expect(customerVerify.createCustomerVerifyBodyRequest(createCustomerBodyErrorCpf)).toBeCalled();
    } catch (error) {
      expect(error).toStrictEqual({ errorCode: 400, message: "CPF inválido" });
    }
  });
});