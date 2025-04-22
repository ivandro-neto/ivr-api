import type { NextFunction, Request, Response } from "express";
import Customer from "../model/customer.model";
import Plan from "../model/plan.model";
import { error } from "console";

export const getCustomerBalance = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { number } = req.body;

    if (!number) {
      //@ts-ignore
      return res.status(400).json({ error: "Number is required" });
    }

    const customer = await Customer.findOne({
      where: { account_number: number },
    });

    if (customer == null) {
      //@ts-ignore
      return res.status(404).json({ error: "account not found" });
    }
    const message = `O seu saldo é de ${customer?.account_balance} kwanzas.`;

    //@ts-ignore
    return res.status(200).json({
      message,
    });
  } catch (error) {
    next(error);
  }
};
export const getActivePlan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { number } = req.body;

    if (!number) {
      //@ts-ignore
      return res.status(400).json({ error: "Number is required" });
    }

    const customer = await Customer.findOne({
      where: { account_number: number },
    });
    const plan = await Plan.findByPk(customer?.active_planId);
    if (!customer) {
      //@ts-ignore
      return res.status(404).json({ error: "account not found" });
    }
    if (!plan) {
      //@ts-ignore
      return res.status(404).json({ error: "Plan not found" });
    }

    const message = `O Plano activo é ${plan.name}.`;

    //@ts-ignore
    return res.status(200).json({
      message,
    });
  } catch (error) {
    next(error);
  }
};

export const activePlan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { number, planId } = req.body;

    if (!number) {
      //@ts-ignore
      return res.status(400).json({ error: "Number is required" });
    }
    if (!planId) {
      //@ts-ignore
      return res.status(400).json({ error: "Plan id is required" });
    }

    const customer = await Customer.findOne({
      where: { account_number: number },
    });
    const plan = await Plan.findOne({
      where: { id: planId },
    });

    if (!customer) {
      //@ts-ignore
      return res.status(404).json({ error: "account not found" });
    }
    if (!plan) {
      //@ts-ignore
      return res.status(404).json({ error: "Plan not found." });
    }

    if (customer.account_balance < plan.weight) {
      let message =
        "Infelizmente não possui saldo suficiente na sua conta para ativar este plano.";
      //@ts-ignore
      return res.status(400).json({
        message,
      });
    }

    customer.active_planId = planId;
    customer.account_balance -= plan.weight;

    let message = `O ${plan.name} foi activado com sucesso.`;

    //@ts-ignore
    return res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
};
export const TransferCredits = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { number, to, amount } = req.body;

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

    const customer = await Customer.findOne({
      where: { account_number: number },
    });
    const destination = await Customer.findOne({
      where: { account_number: to },
    });

    if (!customer) {
      //@ts-ignore
      return res.status(404).json({ error: "account not found" });
    }

    if (!destination) {
      //@ts-ignore
      return res.status(404).json({ error: "account not found" });
    }

    if (customer.account_balance < amount) {
      let message =
        "Infelizmente não possui saldo suficiente na sua conta para realizar esta transferência.";
      //@ts-ignore
      return res.status(400).json({
        message,
      });
    }

    customer.account_balance -= amount;
    destination.account_balance += amount;

    let message = `Foi transferido ${amount} kwanzas para o usuario ${destination.account_name} com sucesso.`;

    //@ts-ignore
    return res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
};
