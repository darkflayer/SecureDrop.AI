require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes"); // Import your routes
const complaintRoutes = require("./routes/complaintRoutes");

const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration for production
const allowedOrigins = [
  process.env.FRONTEND_URL, // Set this in your .env on Render
  "http://localhost:3000",
  "https://securedropai.vercel.app",
  "https://securedropai.vercel.app/",
  "https://securedropai.vercel.app/admin",
  "https://securedropai.vercel.app/admin/*"
];

// Enhanced Socket.IO configuration for production
const io = socketIo(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  transports: ['websocket', 'polling'], // Enable both transports
  allowEIO3: true, // Allow Engine.IO v3 clients
  pingTimeout: 60000, // Increase ping timeout for production
  pingInterval: 25000, // Increase ping interval for production
  upgradeTimeout: 30000, // Increase upgrade timeout
  maxHttpBufferSize: 1e8, // 100 MB buffer size
  allowRequest: (req, callback) => {
    // Allow all requests for now, you can add authentication here later
    callback(null, true);
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Routes
app.use("/api/admin", adminRoutes); // Use your admin routes
app.use("/api/complaint", complaintRoutes);

app.get("/", (req, res) => res.send("SecureDrop.AI API Running ✅"));

// Enhanced Socket.IO connection handling with better error handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  console.log('🌐 Client origin:', socket.handshake.headers.origin);
  console.log('🔑 Client auth:', socket.handshake.auth);

  // Join admin room
  socket.on('join-admin', (orgId) => {
    try {
      socket.join(`admin-${orgId}`);
      console.log(`👨‍💼 Admin joined room: admin-${orgId}`);
      // Send confirmation to client
      socket.emit('admin-joined', { room: `admin-${orgId}`, success: true });
    } catch (error) {
      console.error('Error joining admin room:', error);
      socket.emit('admin-joined', { room: `admin-${orgId}`, success: false, error: error.message });
    }
  });

  // Join complaint tracking room
  socket.on('join-complaint', (complaintId) => {
    try {
      socket.join(`complaint-${complaintId}`);
      console.log(`📋 User joined complaint room: complaint-${complaintId}`);
      // Send confirmation to client
      socket.emit('complaint-joined', { room: `complaint-${complaintId}`, success: true });
    } catch (error) {
      console.error('Error joining complaint room:', error);
      socket.emit('complaint-joined', { room: `complaint-${complaintId}`, success: false, error: error.message });
    }
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log('🔌 Client disconnected:', socket.id, 'Reason:', reason);
  });

  // Handle connection errors
  socket.on('connect_error', (error) => {
    console.error('🔌 Connection error:', error);
  });

  // Handle reconnection attempts
  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log('🔄 Reconnection attempt:', attemptNumber);
  });

  // Handle successful reconnection
  socket.on('reconnect', (attemptNumber) => {
    console.log('✅ Reconnected after', attemptNumber, 'attempts');
  });

  // Handle reconnection failures
  socket.on('reconnect_failed', () => {
    console.error('❌ Reconnection failed');
  });

  // Ping-pong for connection health
  socket.on('ping', () => {
    socket.emit('pong');
  });
});

// Make io available to other modules
app.set('io', io);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Connect DB and Start Server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ MongoDB connected");
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 Allowed origins:`, allowedOrigins);
    console.log(`🔌 Socket.IO enabled with enhanced configuration`);
  });
}).catch(err => console.error("❌ DB Error:", err));