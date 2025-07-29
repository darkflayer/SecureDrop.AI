const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['user', 'admin'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  mediaUrl: { type: String },
  mediaType: { type: String }
}, { _id: false });

const ComplaintSchema = new mongoose.Schema({
  message: { type: String, required: true },
  category: { type: String }, // AI auto-fill
  mediaUrl: { type: String }, // Cloudinary URL
  mediaType: { type: String }, // "image" or "video"
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true
  },
  status: { 
    type: String, 
    enum: ["Pending", "In Progress", "Resolved", "Closed"],
    default: "Pending" 
  },
  reply: { type: String },
  adminReply: { type: String },
  userEmail: { type: String }, // Optional email for notifications

  // Conversation thread
  messages: [MessageSchema],

  // AI-Enhanced Analysis
  aiAnalysis: {
    severity: { 
      type: String, 
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    urgency: { 
      type: String, 
      enum: ['Normal', '24h', 'Immediate'],
      default: 'Normal'
    },
    sentiment: { 
      type: String, 
      enum: ['Positive', 'Neutral', 'Negative', 'Angry'],
      default: 'Neutral'
    },
    safetyFlags: [String], // ['self-harm', 'threats', 'violence', 'harassment']
    riskScore: { type: Number, min: 0, max: 100, default: 0 },
    emotionalTone: String
  },
  
  // AI Suggestions
  aiSuggestions: {
    replyTemplates: [String],
    priorityLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    suggestedActions: [String],
    escalationNeeded: { type: Boolean, default: false }
  },
  
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
ComplaintSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
