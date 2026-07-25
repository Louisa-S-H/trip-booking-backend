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
const PastEvent = require('../models/PastEvent');
const Testimonial = require('../models/Testimonial');
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

  const destinations = [
    {
      name: 'Singapore',
      slug: 'singapore',
      country: 'Singapore',
      summary: 'A vibrant city-state blending culture, food, and modern attractions.',
      description: 'Explore Singapore\'s top sights, campuses, and student-friendly neighborhoods.',
      heroImage: '/images/destination-singapore.jpg',
      order: 1,
    },
    {
      name: 'Hong Kong',
      slug: 'hong-kong',
      country: 'Hong Kong',
      summary: 'A dynamic hub where East meets West, ideal for short educational trips.',
      description: 'From Victoria Peak to local universities, discover Hong Kong with our guided trips.',
      heroImage: '/images/destination-hongkong.jpg',
      order: 2,
    },
    {
      name: 'Other Destinations',
      slug: 'other-destinations',
      country: '',
      summary: 'Have somewhere else in mind? We can build a custom itinerary for it.',
      description: 'Beyond Singapore and Hong Kong, we design custom trips to other destinations on request.',
      heroImage: '/images/destination-other.jpg',
      order: 3,
    },
  ];
  for (const dest of destinations) {
    await Destination.findOneAndUpdate({ slug: dest.slug }, dest, { upsert: true });
  }
  console.log('Synced sample destinations');

  const tripStyles = [
    {
      name: 'Edu Travel',
      slug: 'edu-travel',
      summary: 'Educational trips combining campus visits with cultural immersion.',
      description: 'Edu Travel programmes pair campus visits and guided learning activities with cultural immersion, giving student groups a hands-on complement to classroom learning.',
      heroImage: '/images/about-us-1.jpg',
      order: 1,
    },
    {
      name: 'Incentives Travel',
      slug: 'incentives-travel',
      summary: 'Reward trips designed for top-performing student groups.',
      description: 'Incentives Travel is our reward-trip programme for top-performing student groups, featuring upgraded accommodation and curated experiences as recognition for outstanding achievement.',
      heroImage: '/images/hotel-raffles.jpg',
      order: 2,
    },
    {
      name: 'Other Packages',
      slug: 'other-packages',
      summary: 'Custom packages tailored to your group\'s needs.',
      description: 'Every group is different, so we also design fully custom packages - tell us your goals, budget, and timeline, and we\'ll put together an itinerary to match.',
      heroImage: '/images/destination-other.jpg',
      order: 3,
    },
  ];
  for (const style of tripStyles) {
    await TripStyle.findOneAndUpdate({ slug: style.slug }, style, { upsert: true });
  }
  console.log('Synced sample trip styles');

  const services = [
    { name: 'Economy Flight Ticket', category: 'Flight', price: 450, description: 'Round-trip economy flight.' },
    {
      name: 'Raffles Hotel Singapore (per night)',
      category: 'Hotel',
      price: 320,
      description: 'Iconic colonial-era 5-star hotel in the heart of Singapore.',
      image: '/images/hotel-raffles.jpg',
    },
    {
      name: 'Mercure Hotel Singapore (per night)',
      category: 'Hotel',
      price: 140,
      description: '4-star hotel next to Chinatown, walking distance to the MRT.',
      image: '/images/hotel-mercure.jpg',
    },
    {
      name: 'Backpacker Hostel Dorm Bed (per night)',
      category: 'Hotel',
      price: 45,
      description: 'Budget-friendly shared dorm bed with locker and reading light.',
      image: '/images/hostel-dorm.jpg',
    },
    {
      name: 'Gardens by the Bay Day Pass',
      category: 'Activities',
      price: 28,
      description: 'Entry to the Supertree Grove and conservatories, with Marina Bay Sands views.',
      image: '/images/gardens-by-the-bay.jpg',
    },
    { name: 'City Walking Tour', category: 'Activities', price: 40, description: 'Half-day guided city tour.' },
    { name: 'Explorer Bundle', category: 'Bundles', price: 600, description: 'Flight + hotel + one activity.' },
    { name: 'Airport Meet & Greet', category: 'Meet & Greet', price: 30, description: 'Airport pickup and welcome service.' },
    { name: 'Student Visa Application Support', category: 'Visa Application', price: 80, description: 'Assistance preparing your visa application.' },
  ];
  for (const service of services) {
    await Service.findOneAndUpdate({ name: service.name }, service, { upsert: true });
  }
  console.log('Synced sample services');

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

  const pastEvents = [
    {
      title: 'Sidecar Scooter Heritage Tour, Singapore',
      type: 'Case Study',
      summary: 'A guided vintage sidecar scooter tour through Singapore\'s historic districts.',
      body: 'Our group toured Singapore\'s heritage sites by vintage sidecar scooter, blending sightseeing with a hands-on cultural experience.',
      coverImage: '/images/past-event-scooter-tour.jpg',
      order: 1,
    },
    {
      title: 'Wildlife Park Excursion',
      type: 'Case Study',
      summary: 'Hands-on wildlife encounters as part of an educational day trip.',
      body: 'Students spent the day at a wildlife park, including a guided giraffe feeding session as part of our environmental education programme.',
      coverImage: '/images/past-event-wildlife-park.jpg',
      order: 2,
    },
  ];
  for (const event of pastEvents) {
    await PastEvent.findOneAndUpdate({ title: event.title }, event, { upsert: true });
  }
  console.log('Synced sample past events');

  const testimonials = [
    {
      authorName: 'Priya S.',
      programme: 'Edu Travel - Singapore',
      quote: 'The scooter heritage tour was the highlight of the trip - our agent had every detail sorted before we landed.',
      rating: 5,
      order: 1,
    },
    {
      authorName: 'Marcus T.',
      programme: 'Incentives Travel - Hong Kong',
      quote: 'Smooth booking process from start to finish, and the hotel picks were exactly what our group needed.',
      rating: 5,
      order: 2,
    },
    {
      authorName: 'Aiko N.',
      programme: 'Edu Travel - Singapore',
      quote: 'Loved the wildlife park excursion - great mix of learning and fun for the whole group.',
      rating: 4,
      order: 3,
    },
  ];
  for (const testimonial of testimonials) {
    await Testimonial.findOneAndUpdate({ authorName: testimonial.authorName }, testimonial, { upsert: true });
  }
  console.log('Synced sample testimonials');

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
