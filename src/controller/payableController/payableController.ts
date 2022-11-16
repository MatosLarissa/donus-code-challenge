import { Request, Response } from "express";
import PayableBusiness from "../../business/payable/payableBusiness";
import PayableDataBase from "../../data/payableDataBase/payableDataBase";
import PayableInputDTO from "../../model/playable/playableDto/payableInputDto";
import PayableStatusInputDto from "../../model/playable/playableDto/payableStatusInputDto";
import TransferPayableInputDto from "../../model/playable/playableDto/transferPayableInputDto";

export default class PayableController {

    private payableBusiness: PayableBusiness

    constructor() {
        this.payableBusiness = new PayableBusiness(new PayableDataBase)
    }

    depositPayable = async (req: Request, res: Response) => {
        const input: PayableInputDTO = {
            token: req.headers.authorization,
            paymentMethod: req.body.paymentMethod,
            value: req.body.value,
            description: req.body.description,
            cardNumber: req.body.cardNumber,
            cvv: req.body.cvv,
        }

        try {
            const result = await this.payableBusiness.depositPayable(input)

            res.status(200).send({
                Message: "Pagamento realizada com sucesso!",
                Transaction: result
            })

        } catch (error: any) {
            if (error.message) return res.status(400).send(error.message)
            res.status(400).send("Erro no signup")
        }
    }

    transferPayable = async (req: Request, res: Response) => {
        const input: TransferPayableInputDto = {
            token: req.headers.authorization,
            paymentMethod: req.body.paymentMethod,
            value: req.body.value,
            description: req.body.description,
            cardNumber: req.body.cardNumber,
            cvv: req.body.cvv,
            idTransferCustomer: req.body.idTransferCustomer,
        }

        try {
            const result = await this.payableBusiness.transferPayable(input)

            res.status(200).send({
                Message: "Transferência realizada com sucesso!",
                Transaction: result

            })

        } catch (error: any) {
            if (error.message) return res.status(400).send(error.message)
            res.status(400).send("Erro no signup")
        }
    }

    getAllPayableByUser = async (req: Request, res: Response) => {
        try {
            const input: string | any = req.headers.authorization

            const result = await this.payableBusiness.getAllPayableByUser(input)

            res.status(200).send({
                Transaction: result
            })

        } catch (error: any) {
            if (error.message) return res.status(400).send(error.message)
            res.status(400).send("Erro no signup")
        }
    }

    getPayableByStatus = async (req: Request, res: Response) => {
        try {
            const input: PayableStatusInputDto = {
                token: req.headers.authorization,
                status: req.body.status
            }

            const result = await this.payableBusiness.getPayableByStatus(input)

            res.status(200).send({
                Transaction: result
            })

        } catch (error: any) {
            if (error.message) return res.status(400).send(error.message)
            res.status(400).send("Erro no signup")
        }
    }
}
