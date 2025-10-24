// backend/scripts/seedUsers.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const adminUsers = [
      { username: 'enigoal', passwordHash: 'Enigoal@123', role: 'admin' },
      { username: 'princeeadx', passwordHash: 'Princeex@123', role: 'admin' },
      { username: 'prateekadminx', passwordHash: 'Prateekx@123', role: 'admin' },
      { username: 'purshottamadminx', passwordHash: 'Purshottamx@123', role: 'admin' },
      { username: 'Arunadminx', passwordHash: 'Arunx@123', role: 'admin' },
      { username: 'Shivamadminx', passwordHash: 'Shivamx@123', role: 'admin' },
      // { username: 'admin', passwordHash: 'admin123', role: 'admin' },
      { username: 'manager1', passwordHash: 'password123', role: 'manager' },
      { username: 'manager2', passwordHash: 'password123', role: 'manager' },
    ];

    for (const userData of adminUsers) {
      const exists = await User.findOne({ username: userData.username });
      if (!exists) {
        const user = new User(userData);
        await user.save();
        console.log(`✓ Created user: ${userData.username}`);
      }
    }

    console.log('✅ Seed complete');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedUsers();