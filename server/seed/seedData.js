const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function seed() {
  await connectDB();
  // Seed admin user (idempotent)
  const email = process.env.ADMIN_EMAIL || 'admin@schoolhub.local';
  const name = process.env.ADMIN_NAME || 'Administrator';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  const existing = await User.findOne({ email });
  if (!existing) {
    await User.create({ name, email, password, role: 'admin' });
    console.log(`[seed] Admin created: ${email}`);
  } else {
    console.log(`[seed] Admin already exists: ${email}`);
  }

  console.log('[seed] Seeding complete');
  await mongoose.connection.close();
}

seed().catch(async (e) => {
  console.error('[seed] Error:', e.message);
  try { await mongoose.connection.close(); } catch (_) {}
  process.exit(1);
});
