import type { NextFunction, Request, Response } from "express";
import Customer from "../model/customer.model";
import Plan from "../model/plan.model";
import Operator from "../model/operator.model";

export const getCustomerBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { number } = req.query;
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
      //@ts-ignore
      return res.status(400).json({
        message,
      });
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
    const { number } = req.query;
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

    const customer = await Customer.findOne({
      where: { account_number: number },
    });

    if (!customer) {
      message = "Não foi possível encontrar o cliente.";
      //@ts-ignore
      return res.status(400).json({
        message,
      });
    }
    customer!.account_balance += Number(amount);
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

export const getCustomerInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { number } = req.query;
    let message = "";
    if (!number) {
      //@ts-ignore
      return res.status(400).json({ error: "Number is required" });
    }

    const customer = await Customer.findOne({
      where: { phone_number: number },
    });

    if (customer == null) {
      message = "Não foi possível encontrar o cliente.";
      //@ts-ignore
      return res.status(400).json({
        message,
      });
    }
    const manager = await Operator.findOne({
      where: { id: customer.operator_Id },
    });
    if (manager == null) {
      message = "Não foi possível encontrar o gestor do cliente.";
      //@ts-ignore
      return res.status(400).json({
        message,
      });
    }
    message = `Seja bem-vindo a yucol Angola, ${
      customer.account_gender === "M" ? "Sr." : "Sra."
    } ${customer.account_name}. ${
      manager.operator_gender === "M" ? "O" : "A"
    } ${
      manager.operator_gender === "M" ? "seu" : "sua"
    } operador${
      manager.operator_gender === "M" ? "o" : "a"
    }, ${
      manager.operator_gender === "M" ? "Sr." : "Sra."
    } ${manager.operator_name}, já vai atender. Por favor, aguarde um momento.`;

    //@ts-ignore
    return res.status(200).json({
      message,
      client_name : customer.account_name,
      operator_name : manager.operator_name,
      operator_extension : manager.operator_extension
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

    const customer = await Customer.findOne({
      where: { account_number: number },
    });
    const plan = await Plan.findOne({
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

    if (customer!.account_balance < plan!.weight) {
      message =
        "Infelizmente não possui saldo suficiente na sua conta para ativar este plano.";
      //@ts-ignore
      return res.status(400).json({
        message,
      });
    }

    customer!.active_planId = Number(planId);
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

    const customer = await Customer.findOne({
      where: { account_number: number },
    });
    const destination = await Customer.findOne({
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

    if (customer!.account_balance < Number(amount)) {
      message =
        "Infelizmente não possui saldo suficiente na sua conta para realizar esta transferência.";
      //@ts-ignore
      return res.status(400).json({
        message,
      });
    }

    customer!.account_balance -= Number(amount);
    destination!.account_balance += Number(amount);
    await customer!.save();
    await destination!.save();
    message = `Foi transferido ${amount} kwanzas para o usuario ${destination!.account_name.trim()} com sucesso.`;

    //@ts-ignore
    return res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
};
