const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const app = express();

// Middleware
const cookieParser = require('cookie-parser');
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Vercel Serverless Connection Cache
let cachedDb = null;
const connectDB = async () => {
    if (cachedDb && mongoose.connection.readyState === 1) {
        return cachedDb;
    }
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/redsee';
    cachedDb = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB Connected (Serverless)');
    const seedAdmin = require('./utils/seedAdmin');
    seedAdmin();
    return cachedDb;
};

// Middleware to ensure DB connection before handling routes
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('MongoDB connection error:', err);
        res.status(500).json({ message: 'Database Connection Failed', error: err.message });
    }
});

// Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const homepageRoutes = require('./routes/homepageRoutes');
const eventRoutes = require('./routes/eventRoutes');
const lookbookRoutes = require('./routes/lookbookRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes); // keep for backward compat
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/homepage', homepageRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/studio', lookbookRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/', (req, res) => {
    res.send('Redsee API is running');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

// Socket.IO Wrap for local server execution
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, origin || "*");
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.set('socketio', io);

io.on('connection', (socket) => {
  console.log('Socket user connected:', socket.id);
  
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket joined room: ${roomId}`);
  });

  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`Socket left room: ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket user disconnected:', socket.id);
  });
});

// Vercel Serverless Functions need the app exported
// Local development needs server.listen
if (process.env.NODE_ENV !== 'production') {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
