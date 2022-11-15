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
        }

        try {
            const token = await this.cardBusiness.createCard(input)

            res.status(200).send({
                message: "Cartão criado com sucesso!",
                token
            })

        } catch (error: any) {
            if (error.message) return res.status(400).send(error.message)
            res.status(400).send("Erro no signup")
        }
    }
}
