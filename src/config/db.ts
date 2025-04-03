import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "mssql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: true,
  dialectOptions: {
    options: {
      encrypt: true, // Habilitar SSL se necessário
      trustServerCertificate: true, // Para conexões locais
    },
  },
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw new Error("❌ Database connection failed: " + error);
  }
};

//sequelize.addModels([Customers]);
