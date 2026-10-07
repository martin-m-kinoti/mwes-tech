const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Payments = sequelize.define(
  'Payments',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    checkoutRequestId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    merchantRequestId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    serviceId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('PENDING', 'SUCCESS', 'FAILED'),
      allowNull: false,
      defaultValue: 'PENDING',
    },
    mpesaReceipt: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    amountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    transactionDate: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    payerPhone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    failReason: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'payments',
    timestamps: true,
  }
);

module.exports = { Payments };