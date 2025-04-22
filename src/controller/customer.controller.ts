import type { NextFunction, Request, Response } from "express";
import fetch from "node-fetch";
import fs from "fs";
import * as googleTTS from "google-tts-api"; // Certifique-se de importar corretamente
import Customer from "../model/customer.model";
import { sequelize } from "../config/db";
import { QueryTypes } from "sequelize";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "@ffmpeg-installer/ffmpeg";

ffmpeg.setFfmpegPath(ffmpegPath.path);

const generateAudio = async (text: string, filePath: string) => {
  try {
    console.log("googleTTS:", googleTTS); // Verificar se o módulo está carregado

    const url = googleTTS.getAudioUrl(text, {
      lang: "pt-PT",
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
    const message = `O seu saldo é de ${customer?.account_balance} kwanzas.`;

    const messageEN = `The balance of the customer with number ${number
      .split("")
      .join(" ")} is ${customer?.account_balance} kwanzas.`;

    // Gerando o áudio
    const filename = `balance_${number}_${Date.now()}`;
   // await generateAudio(message, `./public/audio/tmp/${filename}.mp3`);

   /*  ffmpeg(`./public/audio/tmp/${filename}.mp3`)
      .toFormat("wav")
      .audioFrequency(8000) // 8 kHz
      .audioChannels(1) // Mono
      .audioBitrate("16k") // 16-bit equivalent
      .save(`./public/audio/${filename}.wav`)
      .on("end", () => {
        console.log(`Conversion complete: ${filename}.wav`);
      }); */
    //@ts-ignore
    return res.status(200).json({
      /*  number,
      balance: customer?.account_balance, */
      message,
      /*  audio_url: `http://10.15.9.140:${process.env.API_PORT}/audio/${filename}.wav`, */
    });
  } catch (error) {
    next(error); // Passa o erro para o Express
  }
};
