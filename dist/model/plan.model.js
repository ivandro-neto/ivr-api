"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db"); // Certifique-se de importar a conexão com o banco
class Plan extends sequelize_1.Model {
}
exports.Plan = Plan;
Plan.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    weight: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "plans",
    schema: "dbo", // Adicione o schema correto
    timestamps: false,
});
exports.default = Plan;
