const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function seedAdmin() {
  await connectDB();

  const name = process.env.ADMIN_NAME || 'Administrator';
  const email = process.env.ADMIN_EMAIL || 'admin@schoolhub.local';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`[seed] Admin already exists: ${email}`);
    await mongoose.connection.close();
    return;
  }

  await User.create({ name, email, password, role: 'admin' });
  console.log(`[seed] Admin created: ${email}`);

  await mongoose.connection.close();
}

seedAdmin().catch(async (err) => {
  console.error('[seed] Failed to seed admin:', err.message);
  try { await mongoose.connection.close(); } catch (_) {}
  process.exit(1);
});

