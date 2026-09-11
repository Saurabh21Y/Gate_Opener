const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      'MONGO_URI is not configured. Add it to backend/.env, for example: ' +
      'MONGO_URI=mongodb://localhost:27017/gateprep'
    );
  }

  const maxRetries = 5;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      attempts++;
      console.error(`❌ MongoDB connection attempt ${attempts} failed: ${error.message}`);
      if (attempts < maxRetries) {
        console.log(`🔄 Retrying in 3 seconds...`);
        await new Promise((res) => setTimeout(res, 3000));
      } else {
        console.error('💥 All MongoDB connection attempts failed. Exiting.');
        process.exit(1);
      }
    }
  }
};

module.exports = connectDB;
