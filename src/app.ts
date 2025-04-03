import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/router";
import { connectDB } from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use("/audio", express.static("public/audio"));
app.use(express.json());
app.use(cors());
app.use(router);

// Conectar ao banco antes de iniciar o servidor
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Error starting server:", error);
  });
