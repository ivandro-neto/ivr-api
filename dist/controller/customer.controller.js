"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.getCustomerBalance = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs_1 = __importDefault(require("fs"));
const googleTTS = __importStar(require("google-tts-api")); // Certifique-se de importar corretamente
const customer_model_1 = __importDefault(require("../model/customer.model"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const ffmpeg_1 = __importDefault(require("@ffmpeg-installer/ffmpeg"));
fluent_ffmpeg_1.default.setFfmpegPath(ffmpeg_1.default.path);
const generateAudio = (text, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("googleTTS:", googleTTS); // Verificar se o módulo está carregado
        const url = googleTTS.getAudioUrl(text, {
            lang: "pt-PT",
            slow: false,
            host: "https://translate.google.com",
        });
        console.log("URL gerada:", url);
        const response = yield (0, node_fetch_1.default)(url);
        const buffer = yield response.arrayBuffer();
        fs_1.default.writeFileSync(filePath, Buffer.from(buffer));
        console.log("Áudio gerado:", filePath);
        return filePath;
    }
    catch (error) {
        console.error("Erro ao gerar áudio:", error);
        return null;
    }
});
const getCustomerBalance = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { number } = req.body;
        if (!number) {
            //@ts-ignore
            return res.status(400).json({ error: "Number is required" });
        }
        const customer = yield customer_model_1.default.findOne({
            where: { phone_number: number },
        });
        if (customer == null) {
            //@ts-ignore
            return res.status(404).json({ error: "account not found" });
        }
        const message = `O saldo do cliente com número ${number
            .split("")
            .join(" ")} é de ${customer === null || customer === void 0 ? void 0 : customer.account_balance} kwanzas.`;
        // Gerando o áudio
        const filename = `balance_${number}_${Date.now()}`;
        yield generateAudio(message, `./public/audio/tmp/${filename}.mp3`);
        (0, fluent_ffmpeg_1.default)(`./public/audio/tmp/${filename}.mp3`)
            .toFormat("wav")
            .audioFrequency(8000) // 8 kHz
            .audioChannels(1) // Mono
            .audioBitrate("16k") // 16-bit equivalent
            .save(`./public/audio/${filename}.wav`)
            .on("end", () => {
            console.log(`Conversion complete: ${filename}.wav`);
        });
        //@ts-ignore
        return res.status(200).json({
            number,
            balance: customer === null || customer === void 0 ? void 0 : customer.account_balance,
            message,
            audio_url: `http://10.15.9.140:${process.env.API_PORT}/audio/${filename}.wav`,
        });
    }
    catch (error) {
        next(error); // Passa o erro para o Express
    }
});
exports.getCustomerBalance = getCustomerBalance;
