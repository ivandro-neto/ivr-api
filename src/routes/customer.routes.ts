import { Router } from "express";
import {
  activePlan,
  AddCredits,
  getActivePlan,
  getCustomerBalance,
  getCustomerInfo,
  TransferCredits,
} from "../controller/customer.controller";

const customerRouter = Router();

customerRouter.post("/ivr/balance", getCustomerBalance);
customerRouter.post("/ivr/plan", getActivePlan);
customerRouter.post("/ivr/plan/active", activePlan);
customerRouter.post("/ivr/send", TransferCredits);
customerRouter.post("/ivr/balance/add", AddCredits);
customerRouter.post("/ivr/info", getCustomerInfo);

export default customerRouter;
