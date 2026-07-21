const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
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
