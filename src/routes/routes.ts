import express from "express";
import CardController from "../controller/cardController/cardController";
import CustomerController from "../controller/customerController/customerController";

const customerController = new CustomerController()
const cardController = new CardController()

export const customerRouter = express.Router();
export const cardRouter = express.Router();

customerRouter.post("/signup", customerController.createCustomer)
customerRouter.post("/login", customerController.login)

cardRouter.post("/createCard", cardController.createCard)

