const mongoose = require('mongoose');

const mongoUri =
  process.env.MONGO_URI;

mongoose
  .connect(mongoUri, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log('Connected to MongoDB (chat)'))
  .catch((err) =>
    console.error('MongoDB connection error:', err.message)
  );

module.exports = mongoose;