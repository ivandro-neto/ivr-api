"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const customer_controller_1 = require("../controller/customer.controller");
const customerRouter = (0, express_1.Router)();
customerRouter.post("/ivr/balance", customer_controller_1.getCustomerBalance);
exports.default = customerRouter;
