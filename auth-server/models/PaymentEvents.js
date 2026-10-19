const { DataTypes } = require('sequelize');
const sequelize = require('../db');

// Append-only log of M-Pesa STK push lifecycle events, rendered as a timeline
// in the payment UI (initiated -> prompt sent -> success/cancelled/timeout/failed).
const PaymentEvent = sequelize.define(
  'PaymentEvent',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    paymentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    eventCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'payment_events',
    timestamps: true,
    updatedAt: false,
    indexes: [{ fields: ['paymentId'] }],
  }
);

module.exports = { PaymentEvent };
