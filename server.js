// // backend/server.js
// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const session = require('express-session');
// const MongoStore = require('connect-mongo');
// const { connectDB } = require('./config/db');
// const { initializeCRMSync } = require('./services/crmSync');

// // Import routes
// const authRoutes = require('./routes/auth');
// const bookingRoutes = require('./routes/bookings');

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
// }));



// // Session middleware
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: new MongoStore({
//     mongoUrl: process.env.MONGODB_URI,
//   }),
//   cookie: {
//     secure: false, // Set to true if using HTTPS
//     httpOnly: true,
//     maxAge: 1000 * 60 * 60 * 24, // 24 hours
//   },
// }));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/bookings', bookingRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'Server is running' });
// });

// // Error handling
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(500).json({ message: 'Internal server error' });
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// connectDB().then(async () => {
//   await initializeCRMSync();
//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on http://localhost:${PORT}`);
//   });
// });











require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { connectDB } = require('./config/db');
const { initializeCRMSync } = require('./services/crmSync');

// Import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ⭐ UPDATED CORS for Production
const allowedOrigins = [
  'https://doc.enigoal.in',
  'http://localhost:3000',
  process.env.FRONTEND_URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ⭐ UPDATED Session for Production
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // Lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Important!
    domain: process.env.NODE_ENV === 'production' ? '.enigoal.in' : undefined
  },
  proxy: process.env.NODE_ENV === 'production' // Trust proxy in production
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Booking Management System API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      bookings: '/api/bookings'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await initializeCRMSync();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV}`);
    console.log(`🌐 CORS enabled for: ${allowedOrigins.join(', ')}`);
  });
}).catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});