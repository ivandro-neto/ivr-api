import {Router} from "express";
import { getCustomerBalance } from "../controller/customer.controller";

const customerRouter = Router();

customerRouter.post("/ivr/balance", getCustomerBalance);

export default customerRouter;