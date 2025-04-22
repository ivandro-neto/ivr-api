import { Router } from "express";
import {
  activePlan,
  getActivePlan,
  getCustomerBalance,
  TransferCredits,
} from "../controller/customer.controller";

const customerRouter = Router();

customerRouter.post("/ivr/balance", getCustomerBalance);
customerRouter.post("/ivr/plan", getActivePlan);
customerRouter.post("/ivr/plan/active", activePlan);
customerRouter.post("/ivr/send", TransferCredits);

export default customerRouter;
