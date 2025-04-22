import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db"; // Certifique-se de importar a conexão com o banco

export class Plan extends Model {
  public id!: number;
  public name!: string;
  public weight!: number;
}

Plan.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "plans",
    schema: "dbo", // Adicione o schema correto
    timestamps: false,
  }
);

export default Plan;
