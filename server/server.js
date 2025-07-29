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
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static('uploads'));


// Routes
app.use("/api/admin", adminRoutes); // Use your admin routes
app.use("/api/complaint", complaintRoutes);


app.get("/", (req, res) => res.send("SecureDrop.AI API Running ✅"));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);

  // Join admin room
  socket.on('join-admin', (orgId) => {
    socket.join(`admin-${orgId}`);
    console.log(`👨‍💼 Admin joined room: admin-${orgId}`);
  });

  // Join complaint tracking room
  socket.on('join-complaint', (complaintId) => {
    socket.join(`complaint-${complaintId}`);
    console.log(`📋 User joined complaint room: complaint-${complaintId}`);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
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
  server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch(err => console.error("❌ DB Error:", err));