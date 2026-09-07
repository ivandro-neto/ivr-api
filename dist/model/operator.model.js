"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operator = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db"); // Certifique-se de importar a conexão com o banco
class Operator extends sequelize_1.Model {
}
exports.Operator = Operator;
Operator.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    operator_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    operator_gender: {
        type: sequelize_1.DataTypes.STRING(1),
        validate: {
            isIn: [["M", "F"]], // ✅ Correct way to enforce allowed values
        },
        allowNull: false,
    },
    operator_extension: {
        type: sequelize_1.DataTypes.BIGINT,
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "operators",
    schema: "dbo", // Adicione o schema correto
    timestamps: false,
});
exports.default = Operator;
