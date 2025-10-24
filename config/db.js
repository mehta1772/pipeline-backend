// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // BMS Database
    const bmsDb = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ BMS Database Connected');
    return bmsDb;
  } catch (error) {
    console.error('❌ Database Connection Error:', error);
    process.exit(1);
  }
};

// Separate connection for CRM (read-only)
const connectCRMDB = async () => {
  try {
    const crmConnection = mongoose.createConnection(
      process.env.CRM_MONGODB_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('✅ CRM Database Connected (Read-only)');
    return crmConnection;
  } catch (error) {
    console.error('❌ CRM Database Connection Error:', error);
  }
};

module.exports = { connectDB, connectCRMDB };