const mongoose = require('mongoose');
const env = require('./env');

const connectDatabase = async (uri = env.mongodbUri) => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(uri);
};

const disconnectDatabase = async () => {
  await mongoose.connection.close();
};

module.exports = {
  connectDatabase,
  disconnectDatabase
};
