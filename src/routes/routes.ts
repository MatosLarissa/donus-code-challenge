import express from "express";
import CustomerController from "../controller/customerController/customerController";

const customerController = new CustomerController()

const customerRouter = express.Router();

customerRouter.post("/signup", customerController.createCustomer)
customerRouter.post("/login", customerController.login)

export default customerRouter;