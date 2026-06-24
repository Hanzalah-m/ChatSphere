const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config

const connectDb = async () => {
  try {
    const uri = process.env.DB_URI;
    if (!uri) {
      throw new Error('DB_URI is not defined in the .env file');
    }

    await mongoose.connect(uri);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDb;