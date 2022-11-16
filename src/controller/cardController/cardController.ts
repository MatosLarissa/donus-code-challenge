import { Request, Response } from "express";
import { CardBusiness } from "../../business/card/cardBusiness";
import CardDataBase from "../../data/cardDataBase/cardDataBase";
import CardInputDTO from "../../model/card/cardDto/cardInputDto";

export default class CardController {

    private cardBusiness: CardBusiness

    constructor() {
        this.cardBusiness = new CardBusiness(new CardDataBase)
    }

    createCard = async (req: Request, res: Response) => {

        const input: CardInputDTO = {
            token: req.headers.authorization,
            cardCustomerName: req.body.cardCustomerName,
            cardNumber: req.body.cardNumber,
            cvv: req.body.cvv,
            amount: req.body.amount,
        }

        try {
            const result = await this.cardBusiness.createCard(input)

            res.status(200).send({
                Message: "Cartão criado com sucesso!",
                Card: result
            })

        } catch (error: any) {
            if (error.message) return res.status(400).send(error.message)
            res.status(400).send("Erro no signup")
        }
    }

    getAllCardByCustomerId = async (req: Request, res: Response) => {
        const token: string | any = req.headers.authorization
        try {
            const result = await this.cardBusiness.getAllCardByCustomerId(token)
            res.status(200).send({ Cards: result })

        } catch (error: any) {
            if (error.message) return res.status(400).send(error.message)
            res.status(400).send("Erro no signup")
        }
    }
}
