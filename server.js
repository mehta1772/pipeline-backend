// backend/server.js
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

const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const emailRoutes = require('./routes/email'); // ⭐ NEW

const app = express();

// Trust proxy
app.set('trust proxy', 1);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
const allowedOrigins = [
  'https://doc.enigoal.in',
  'http://doc.enigoal.in',
  'http://localhost:3000',
  'http://localhost:5000'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie']
}));


// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-secret',
  resave: false,
  saveUninitialized: false,
  name: 'bms.sid',
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  },
  proxy: process.env.NODE_ENV === 'production'
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/email', emailRoutes); // ⭐ NEW

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'Server is running',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root
app.get('/', (req, res) => {
  res.json({ message: 'BMS API v1.0' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Start
const PORT = process.env.PORT || 5000;
connectDB().then(async () => {
  await initializeCRMSync();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server on port ${PORT}`);
    console.log(`📝 Env: ${process.env.NODE_ENV || 'development'}`);
  });
}).catch(err => {
  console.error('Failed to start:', err);
  process.exit(1);
});