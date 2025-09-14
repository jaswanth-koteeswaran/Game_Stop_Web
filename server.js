const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamestop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import routes
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const sessionRoutes = require('./routes/sessions');
const foodRoutes = require('./routes/food');
const reportRoutes = require('./routes/reports');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/reports', reportRoutes);

// Serve static files
app.use(express.static('public'));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join admin room
  socket.on('join-admin', () => {
    socket.join('admin');
    console.log('👨‍💼 Admin joined:', socket.id);
  });

  // Join customer room
  socket.on('join-customer', () => {
    socket.join('customer');
    console.log('👤 Customer joined:', socket.id);
  });

  // Handle new booking
  socket.on('new-booking', (booking) => {
    socket.to('admin').emit('booking-created', booking);
    console.log('📝 New booking created:', booking.id);
  });

  // Handle session updates
  socket.on('session-update', (session) => {
    socket.to('admin').emit('session-updated', session);
    console.log('🎮 Session updated:', session.id);
  });

  // Handle food order updates
  socket.on('food-order-update', (order) => {
    socket.to('admin').emit('food-order-updated', order);
    console.log('🍕 Food order updated:', order.id);
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access the app at: http://localhost:${PORT}`);
});

module.exports = { app, server, io };

