import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db"; // Certifique-se de importar a conexão com o banco

export class Customer extends Model {
  public id!: number;
  public account_number!: string;
  public account_name!: string;
  public account_balance!: number;
  public account_gender! : "M" | "F";
  public active_planId!: number;
  public operator_Id!: number;
}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    account_number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    account_balance: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    account_gender: {
      type: DataTypes.ENUM,
      values: ["M", "F"],
      allowNull: false,
    },
    active_planId: {
      type: DataTypes.INTEGER,
      references: "plans",
      allowNull : true
    },
    operator_Id: {
      type: DataTypes.INTEGER,
      references: "operators",
      allowNull : false
    },
  },
  {
    sequelize,
    tableName: "customers",
    schema: "dbo", // Adicione o schema correto
    timestamps: false,
  }
);

export default Customer;
