
import { Request, Response } from "express";
import signUpInputDto from "../../model/customer/customerDto/signUpInputDto";
import signInInputDto from "../../model/customer/customerDto/signInInputDto";
import CustomerBusiness from "../../business/customer/customerBusiness";
import CustomerDataBase from "../../data/customerDataBase/customerDataBase";

export default class CustomerController {

    private customerBusiness: CustomerBusiness

    constructor() {
        this.customerBusiness = new CustomerBusiness(new CustomerDataBase)
    }

    createCustomer = async (req: Request, res: Response) => {

        const input: signInInputDto = {
            fullName: req.body.fullName,
            cpf: req.body.cpf,
            email: req.body.email,
            password: req.body.password
        }

        try {
            const token = await this.customerBusiness.createCustomer(input)
            res.status(200).send({
                message: "Cliente criado com sucesso!",
                token
            })

        } catch (error: any) {
            if (error.message) return res.status(400).send(error.message)
            res.status(400).send("Erro ao criar o cadastrado")
        }
    }
}

