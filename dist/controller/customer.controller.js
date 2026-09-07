"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransferCredits = exports.activePlan = exports.getCustomerInfo = exports.AddCredits = exports.getActivePlan = exports.getCustomerBalance = void 0;
const customer_model_1 = __importDefault(require("../model/customer.model"));
const plan_model_1 = __importDefault(require("../model/plan.model"));
const operator_model_1 = __importDefault(require("../model/operator.model"));
const getCustomerBalance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { number } = req.query;
        let message = "";
        if (!number) {
            //@ts-ignore
            return res.status(400).json({ error: "Number is required" });
        }
        console.log("number", number);
        const customer = yield customer_model_1.default.findOne({
            where: { account_number: number },
        });
        if (customer == null) {
            message = "Não foi possível encontrar o cliente.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        message = `O seu saldo é de ${customer === null || customer === void 0 ? void 0 : customer.account_balance} kwanzas.`;
        //@ts-ignore
        return res.status(200).json({
            message,
        });
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});
exports.getCustomerBalance = getCustomerBalance;
const getActivePlan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { number } = req.query;
        let message = "";
        if (!number) {
            //@ts-ignore
            return res.status(400).json({ error: "Number is required" });
        }
        const customer = yield customer_model_1.default.findOne({
            where: { account_number: number },
        });
        const plan = yield plan_model_1.default.findOne({ where: { id: customer === null || customer === void 0 ? void 0 : customer.active_planId } });
        if (!customer) {
            message = "Não foi possível encontrar o cliente.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        if (!plan) {
            message = "Não foi possível encontrar o plano.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        message = `O Plano activo é ${plan === null || plan === void 0 ? void 0 : plan.name.trim()}.`;
        //@ts-ignore
        return res.status(200).json({
            message,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getActivePlan = getActivePlan;
const AddCredits = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { number, amount } = req.query;
        let message = "";
        if (!number) {
            //@ts-ignore
            return res.status(400).json({ error: "Number is required" });
        }
        if (!amount) {
            //@ts-ignore
            return res.status(400).json({ error: "Amount is required" });
        }
        const customer = yield customer_model_1.default.findOne({
            where: { account_number: number },
        });
        if (!customer) {
            message = "Não foi possível encontrar o cliente.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        customer.account_balance += Number(amount);
        yield customer.save();
        message = `Foi adicionado ${amount} Kwanzas no seu saldo actual.`;
        //@ts-ignore
        return res.status(200).json({
            message,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.AddCredits = AddCredits;
const getCustomerInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { number } = req.query;
        let message = "";
        if (!number) {
            //@ts-ignore
            return res.status(400).json({ error: "Number is required" });
        }
        const customer = yield customer_model_1.default.findOne({
            where: { account_number: number },
        });
        if (customer == null) {
            message = "Não foi possível encontrar o cliente.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        const manager = yield operator_model_1.default.findOne({
            where: { id: customer.operator_Id },
        });
        if (manager == null) {
            message = "Não foi possível encontrar o gestor do cliente.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        message = `${manager.operator_gender === "M" ? "O" : "A"} ${manager.operator_gender === "M" ? "seu" : "sua"} gestor${manager.operator_gender === "M" ? "" : "a"}, ${manager.operator_gender === "M" ? "Sr." : "Sra."} ${manager.operator_name}, já vai atender. Por favor, aguarde um momento.`;
        //@ts-ignore
        return res.status(200).json({
            message,
            client_name: customer.account_name,
            operator_name: manager.operator_name,
            operator_extension: manager.operator_extension,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getCustomerInfo = getCustomerInfo;
const activePlan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { number, planId } = req.query;
        let message = "";
        if (!number) {
            //@ts-ignore
            return res.status(400).json({ error: "Number is required" });
        }
        if (!planId) {
            //@ts-ignore
            return res.status(400).json({ error: "Plan id is required" });
        }
        const customer = yield customer_model_1.default.findOne({
            where: { account_number: number },
        });
        const plan = yield plan_model_1.default.findOne({
            where: { id: planId },
        });
        if (!customer) {
            message = "Não foi possível encontrar o cliente.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        if (!plan) {
            message = "Não foi possível encontrar o plano.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        if (customer.account_balance < plan.weight) {
            message =
                "Infelizmente não possui saldo suficiente na sua conta para ativar este plano.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        customer.active_planId = Number(planId);
        customer.account_balance -= plan.weight;
        yield customer.save();
        message = `O ${plan.name.trim()} foi activado com sucesso.`;
        //@ts-ignore
        return res.status(200).json({ message });
    }
    catch (err) {
        next(err);
    }
});
exports.activePlan = activePlan;
const TransferCredits = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { number, to, amount } = req.query;
        let message = "";
        if (!number) {
            //@ts-ignore
            return res.status(400).json({ error: "Number is required" });
        }
        if (!to) {
            //@ts-ignore
            return res.status(400).json({ error: "destination number is required" });
        }
        if (!amount) {
            //@ts-ignore
            return res.status(400).json({ error: "amount is required" });
        }
        const customer = yield customer_model_1.default.findOne({
            where: { account_number: number },
        });
        const destination = yield customer_model_1.default.findOne({
            where: { account_number: to },
        });
        if (!customer) {
            message = "Não foi possível encontrar o cliente.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        if (!destination) {
            message = "Não foi possível encontrar o cliente de destino.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        if (customer.account_balance < Number(amount)) {
            message =
                "Infelizmente não possui saldo suficiente na sua conta para realizar esta transferência.";
            //@ts-ignore
            return res.status(400).json({
                message,
            });
        }
        customer.account_balance -= Number(amount);
        destination.account_balance += Number(amount);
        yield customer.save();
        yield destination.save();
        message = `Foi transferido ${amount} kwanzas para o usuario ${destination.account_name.trim()} com sucesso.`;
        //@ts-ignore
        return res.status(200).json({ message });
    }
    catch (err) {
        next(err);
    }
});
exports.TransferCredits = TransferCredits;
