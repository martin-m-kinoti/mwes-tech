const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firebaseUid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userEmail: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    service: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryDuration: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In progress', 'Completed'),
      allowNull: false,
      defaultValue: 'Pending',
    },
  },
  {
    tableName: 'orders',
    timestamps: true,
  }
);

module.exports = Order;