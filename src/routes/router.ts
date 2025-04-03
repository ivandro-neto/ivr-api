import { Router } from "express";
import customerRouter from "./customer.routes";
const router = Router();

router.use("/api/", customerRouter);

export default router;
