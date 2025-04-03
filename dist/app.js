"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const router_1 = __importDefault(require("./routes/router"));
const db_1 = require("./config/db");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.API_PORT || 3000;
app.use("/audio", express_1.default.static("public/audio"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(router_1.default);
// Conectar ao banco antes de iniciar o servidor
(0, db_1.connectDB)()
    .then(() => {
    app.listen(PORT, () => {
        console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
})
    .catch((error) => {
    console.error("❌ Error starting server:", error);
});
