import express from "express";
import CardController from "../controller/cardController/cardController";
import CustomerController from "../controller/customerController/customerController";
import PayableController from "../controller/payableController/payableController";

const customerController = new CustomerController()
const cardController = new CardController()
const payableController = new PayableController()

export const customerRouter = express.Router();
export const cardRouter = express.Router();
export const payableRouter = express.Router();

customerRouter.post("/signup", customerController.createCustomer)
customerRouter.post("/login", customerController.login)

cardRouter.post("/createCard", cardController.createCard)

payableRouter.post("/payable", payableController.createPayable)
payableRouter.get("/allpayable", payableController.getAllPayableByUser)
payableRouter.get("/payable/status", payableController.getPayableByStatus)


