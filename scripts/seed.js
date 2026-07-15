// Bootstraps a fresh database: creates the first Admin account (since
// public signup only ever creates students) plus sample CMS content so
// the public site and admin panel aren't empty on first run.
// Usage: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('../models/User');
const Service = require('../models/Service');
const Destination = require('../models/Destination');
const TripStyle = require('../models/TripStyle');
const TeamMember = require('../models/TeamMember');
const SiteContent = require('../models/SiteContent');

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password123';

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trip-booking');
  console.log('Connected to MongoDB for seeding');

  const existingAdmin = await User.findOne({ role: 'admin' });
  if (existingAdmin) {
    console.log(`Admin already exists (${existingAdmin.email}), skipping admin creation`);
  } else {
    await User.create({
      name: 'Site Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`Created admin account: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  }

  const destinationCount = await Destination.countDocuments();
  if (destinationCount === 0) {
    await Destination.insertMany([
      {
        name: 'Singapore',
        slug: 'singapore',
        country: 'Singapore',
        summary: 'A vibrant city-state blending culture, food, and modern attractions.',
        description: 'Explore Singapore\'s top sights, campuses, and student-friendly neighborhoods.',
        order: 1,
      },
      {
        name: 'Hong Kong',
        slug: 'hong-kong',
        country: 'Hong Kong',
        summary: 'A dynamic hub where East meets West, ideal for short educational trips.',
        description: 'From Victoria Peak to local universities, discover Hong Kong with our guided trips.',
        order: 2,
      },
    ]);
    console.log('Seeded sample destinations');
  }

  const tripStyleCount = await TripStyle.countDocuments();
  if (tripStyleCount === 0) {
    await TripStyle.insertMany([
      {
        name: 'Edu Travel',
        slug: 'edu-travel',
        summary: 'Educational trips combining campus visits with cultural immersion.',
        order: 1,
      },
      {
        name: 'Incentives Travel',
        slug: 'incentives-travel',
        summary: 'Reward trips designed for top-performing student groups.',
        order: 2,
      },
      {
        name: 'Other Packages',
        slug: 'other-packages',
        summary: 'Custom packages tailored to your group\'s needs.',
        order: 3,
      },
    ]);
    console.log('Seeded sample trip styles');
  }

  const serviceCount = await Service.countDocuments();
  if (serviceCount === 0) {
    await Service.insertMany([
      { name: 'Economy Flight Ticket', category: 'Flight', price: 450, description: 'Round-trip economy flight.' },
      { name: 'Standard Hotel Room (per night)', category: 'Hotel', price: 120, description: '3-star hotel, twin share.' },
      { name: 'City Walking Tour', category: 'Activities', price: 40, description: 'Half-day guided city tour.' },
      { name: 'Explorer Bundle', category: 'Bundles', price: 600, description: 'Flight + hotel + one activity.' },
      { name: 'Airport Meet & Greet', category: 'Meet & Greet', price: 30, description: 'Airport pickup and welcome service.' },
      { name: 'Student Visa Application Support', category: 'Visa Application', price: 80, description: 'Assistance preparing your visa application.' },
    ]);
    console.log('Seeded sample services');
  }

  const teamCount = await TeamMember.countDocuments();
  if (teamCount === 0) {
    await TeamMember.create({
      name: 'Jane Doe',
      role: 'Programme Director',
      bio: 'Leads our trip design team with 10+ years in student travel.',
      order: 1,
    });
    console.log('Seeded sample team member');
  }

  await SiteContent.findOneAndUpdate(
    { key: 'company_profile' },
    {
      key: 'company_profile',
      title: 'Company Profile',
      body: 'We design and run educational and incentive trips for student groups worldwide.',
    },
    { upsert: true }
  );
  await SiteContent.findOneAndUpdate(
    { key: 'vision_mission' },
    {
      key: 'vision_mission',
      title: 'Vision & Mission',
      body: 'Our mission is to make meaningful travel accessible to every student group.',
    },
    { upsert: true }
  );
  await SiteContent.findOneAndUpdate(
    { key: 'contact_info' },
    {
      key: 'contact_info',
      title: 'Contact Us',
      body: 'Email: hello@example.com | Hotline: +852 1234 5678',
    },
    { upsert: true }
  );
  console.log('Seeded site content blocks');

  console.log('Seeding complete');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
