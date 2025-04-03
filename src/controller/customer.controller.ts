import type { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";
import fs from "fs";
import * as googleTTS from "google-tts-api"; // Certifique-se de importar corretamente
import Customer from "../model/customer.model";
import {sequelize} from "../config/db"
import { QueryTypes } from "sequelize";
const generateAudio = async (text: string, filePath: string) => {
  try {
    console.log("googleTTS:", googleTTS); // Verificar se o módulo está carregado

    const url = googleTTS.getAudioUrl(text, {
      lang: "pt",
      slow: false,
      host: "https://translate.google.com",
    });

    console.log("URL gerada:", url);

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));

    console.log("Áudio gerado:", filePath);
    return filePath;
  } catch (error) {
    console.error("Erro ao gerar áudio:", error);
    return null;
  }
};

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
      where: { phone_number: number },
    });

    if (customer == null) {
      //@ts-ignore
      return res.status(404).json({ error: "account not found" });
    }
    const message = `O saldo do cliente com número ${number} é de ${customer?.account_balance} kwanzas.`;

    // Gerando o áudio
    const filename = `balance_${number}_${Date.now()}.mp3`;
    await generateAudio(message, `./public/audio/${filename}`);
    //@ts-ignore
    return res.status(200).json({
      number,
      balance: customer?.account_balance,
      message,
      audio_url: `/audio/${filename}`,
    });
  } catch (error) {
    next(error); // Passa o erro para o Express
  }
};
