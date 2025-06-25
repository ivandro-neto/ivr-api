import type { NextFunction, Request, Response } from "express";
import Customer from "../model/customer.model";
import Plan from "../model/plan.model";

export const getCustomerBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { number } = req.body;
    let message = "";
    if (!number) {
      //@ts-ignore
      return res.status(400).json({ error: "Number is required" });
    }

    const customer = await Customer.findOne({
      where: { account_number: number },
    });

    if (customer == null) {
      message = "Não foi possível encontrar o cliente.";
    }
    message = `O seu saldo é de ${customer?.account_balance} kwanzas.`;

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
  next: NextFunction
): Promise<void> => {
  try {
    const { number } = req.body;
    let message = "";
    if (!number) {
      //@ts-ignore
      return res.status(400).json({ error: "Number is required" });
    }

    const customer = await Customer.findOne({
      where: { account_number: number },
    });
    const plan = await Plan.findOne({ where: { id: customer?.active_planId } });
    if (!customer) {
      message = "Não foi possível encontrar o cliente.";
    }
    if (!plan) {
      message = "Não foi possível encontrar o plano.";
    }

    message = `O Plano activo é ${plan?.name.trim()}.`;

    //@ts-ignore
    return res.status(200).json({
      message,
    });
  } catch (error) {
    next(error);
  }
};
export const AddCredits = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { number, amount } = req.body;
    let message = "";
    if (!number) {
      //@ts-ignore
      return res.status(400).json({ error: "Number is required" });
    }
    if (!amount) {
      //@ts-ignore
      return res.status(400).json({ error: "Amount is required" });
    }

    const customer = await Customer.findOne({
      where: { account_number: number },
    });

    if (!customer) {
      message = "Não foi possível encontrar o cliente.";
    }
    customer!.account_balance += amount;
    await customer!.save();

    message = `Foi adicionado ${amount} Kwanzas no seu saldo actual.`;

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
  next: NextFunction
): Promise<void> => {
  try {
    const { number, planId } = req.body;
    let message = "";
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
      message = "Não foi possível encontrar o cliente.";
    }
    if (!plan) {
      message = "Não foi possível encontrar o plano.";
    }

    if (customer!.account_balance < plan!.weight) {
      message =
        "Infelizmente não possui saldo suficiente na sua conta para ativar este plano.";
      //@ts-ignore
      return res.status(400).json({
        message,
      });
    }

    customer!.active_planId = planId;
    customer!.account_balance -= plan!.weight;
    await customer!.save();
    message = `O ${plan!.name.trim()} foi activado com sucesso.`;

    //@ts-ignore
    return res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
};
export const TransferCredits = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { number, to, amount } = req.body;
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

    const customer = await Customer.findOne({
      where: { account_number: number },
    });
    const destination = await Customer.findOne({
      where: { account_number: to },
    });

    if (!customer) {
      message = "Não foi possível encontrar o cliente.";
    }

    if (!destination) {
      message = "Não foi possível encontrar o cliente de destino.";
    }

    if (customer!.account_balance < amount) {
      message =
        "Infelizmente não possui saldo suficiente na sua conta para realizar esta transferência.";
      //@ts-ignore
      return res.status(400).json({
        message,
      });
    }

    customer!.account_balance -= amount;
    destination!.account_balance += amount;
    await customer!.save();
    await destination!.save();
    message = `Foi transferido ${amount} kwanzas para o usuario ${destination!.account_name.trim()} com sucesso.`;

    //@ts-ignore
    return res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
};
