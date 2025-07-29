const Complaint = require("../models/Complaint");
const Organization = require("../models/Organization");
const { categorizeComplaint } = require("../utils/categorizer");
const { analyzeComplaint, findSimilarComplaints } = require("../utils/aiAnalyzer");

exports.submitComplaint = async (req, res) => {
  try {
    const { message, orgCode, userEmail } = req.body;

    if (!message || !orgCode) {
      return res.status(400).json({ msg: "Message and orgCode are required" });
    }

    const org = await Organization.findOne({ orgCode });
    if (!org) return res.status(404).json({ msg: "Organization not found" });

    let mediaUrl = null, mediaType = null;
    if (req.file) {
      mediaUrl = req.file.path; // Cloudinary URL
      mediaType = req.file.mimetype.startsWith("video") ? "video" : "image";
      console.log("File uploaded to Cloudinary:", { 
        originalname: req.file.originalname, 
        mimetype: req.file.mimetype, 
        cloudinaryUrl: req.file.path
      });
    }

    const category = await categorizeComplaint(message);

    // Enhanced AI Analysis
    const aiAnalysis = await analyzeComplaint(message, category);
    
    // Find similar complaints
    const existingComplaints = await Complaint.find({ organization: org._id }).limit(10);
    const similarComplaints = await findSimilarComplaints(
      { message, category }, 
      existingComplaints
    );

    const complaint = await Complaint.create({
      message,
      category,
      organization: org._id,
      mediaUrl,
      mediaType,
      userEmail,
      aiAnalysis: {
        severity: aiAnalysis.severity,
        urgency: aiAnalysis.urgency,
        sentiment: aiAnalysis.sentiment,
        safetyFlags: aiAnalysis.safetyFlags,
        riskScore: aiAnalysis.riskScore,
        emotionalTone: aiAnalysis.emotionalTone
      },
      aiSuggestions: {
        replyTemplates: aiAnalysis.replyTemplates,
        priorityLevel: aiAnalysis.priorityLevel,
        suggestedActions: aiAnalysis.suggestedActions,
        escalationNeeded: aiAnalysis.escalationNeeded
      }
    });

    // Emit real-time update to admin with AI insights
    const io = req.app.get('io');
    if (io) {
      io.to(`admin-${org._id}`).emit('new-complaint', {
        complaintId: complaint._id,
        message: complaint.message,
        category: complaint.category,
        status: complaint.status,
        createdAt: complaint.createdAt,
        hasMedia: !!complaint.mediaUrl,
        aiAnalysis: complaint.aiAnalysis,
        aiSuggestions: complaint.aiSuggestions,
        similarComplaints: similarComplaints,
        priorityLevel: complaint.aiSuggestions.priorityLevel
      });
      console.log(`📢 Emitted new complaint with AI analysis to admin-${org._id}`);
    }

    res.status(201).json({ 
      complaintId: complaint._id,
      message: "Complaint submitted successfully. You can track your complaint using the complaint ID."
    });
  } catch (err) {
    console.error('Complaint submission error:', err.message);
    console.error('Error stack:', err.stack);
    res.status(500).json({ msg: "Internal error", error: err.message });
  }
};

// Add follow-up message to complaint (anonymous user)
exports.addUserMessage = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { text, mediaUrl, mediaType } = req.body;
    if (!text) return res.status(400).json({ msg: "Message text is required" });

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    const message = {
      sender: 'user',
      text,
      mediaUrl,
      mediaType,
      timestamp: new Date()
    };
    complaint.messages.push(message);
    await complaint.save();

    // Emit real-time update to admin
    const io = req.app.get('io');
    if (io) {
      io.to(`admin-${complaint.organization}`).emit('user-message', {
        complaintId,
        message
      });
    }

    res.json({
      msg: "Message sent",
      messages: complaint.messages
    });
  } catch (err) {
    console.error('Add user message error:', err.message);
    res.status(500).json({ msg: "Internal error", error: err.message });
  }
};

// Track complaint by ID
exports.trackComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const complaint = await Complaint.findById(complaintId)
      .populate('organization', 'name orgCode');

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    res.json({
      complaintId: complaint._id,
      message: complaint.message,
      category: complaint.category,
      status: complaint.status,
      adminReply: complaint.adminReply,
      organization: complaint.organization.name,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      hasMedia: !!complaint.mediaUrl,
      mediaUrl: complaint.mediaUrl,
      aiAnalysis: {
        severity: complaint.aiAnalysis?.severity,
        urgency: complaint.aiAnalysis?.urgency,
        sentiment: complaint.aiAnalysis?.sentiment,
        emotionalTone: complaint.aiAnalysis?.emotionalTone
      },
      messages: complaint.messages || []
    });
  } catch (err) {
    console.error('Track complaint error:', err.message);
    res.status(500).json({ msg: "Internal error", error: err.message });
  }
};
