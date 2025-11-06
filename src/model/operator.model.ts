import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db"; // Certifique-se de importar a conexão com o banco

export class Operator extends Model {
  public id!: number;
  public operator_name!: string;
  public operator_gender!: "M" | "F";
  public operator_extension!: number;
}

Operator.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    operator_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    operator_gender: {
      type: DataTypes.STRING(1),
      validate: {
        isIn: [["M", "F"]], // ✅ Correct way to enforce allowed values
      },
      allowNull: false,
    },
    operator_extension: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "operators",
    schema: "dbo", // Adicione o schema correto
    timestamps: false,
  }
);

export default Operator;
