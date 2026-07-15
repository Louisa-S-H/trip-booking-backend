const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const errorHandler = require('./middleware/errorHandler');

if (!process.env.JWT_SECRET) {
  console.warn(
    'WARNING: JWT_SECRET is not set in the environment. Falling back to an ' +
    'insecure default - set JWT_SECRET in your .env before deploying.'
  );
}

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trip-booking')
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/users', require('./routes/users'));
app.use('/api/team', require('./routes/team'));
app.use('/api/destinations', require('./routes/destinations'));
app.use('/api/trip-styles', require('./routes/tripStyles'));
app.use('/api/past-events', require('./routes/pastEvents'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/content', require('./routes/content'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Centralized error handler - must be registered after all routes
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
