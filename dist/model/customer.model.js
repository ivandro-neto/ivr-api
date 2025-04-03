"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const sequelize_1 = require("sequelize");
const db_1 = require("../config/db"); // Certifique-se de importar a conexão com o banco
class Customer extends sequelize_1.Model {
}
exports.Customer = Customer;
Customer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    phone_number: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    customer_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    account_balance: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: "customers",
    schema: "dbo", // Adicione o schema correto
    timestamps: false,
});
exports.default = Customer;
