import { Router } from "express";
import {
  activePlan,
  AddCredits,
  getActivePlan,
  getCustomerBalance,
  TransferCredits,
} from "../controller/customer.controller";

const customerRouter = Router();

customerRouter.post("/ivr/balance", getCustomerBalance);
customerRouter.post("/ivr/plan", getActivePlan);
customerRouter.post("/ivr/plan/active", activePlan);
customerRouter.post("/ivr/send", TransferCredits);
customerRouter.post("/ivr/balance/add", AddCredits);

export default customerRouter;
