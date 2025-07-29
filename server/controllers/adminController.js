const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Organization = require("../models/Organization");
const Complaint = require("../models/Complaint");
const { generateSmartReplies, analyzeComplaintTrends, analyzeComplaint } = require("../utils/aiAnalyzer");
const { sendPasswordResetEmail } = require("../utils/emailService");

// Organization management
exports.updateOrganization = async (req, res) => {
  try {
    const { name, orgCode } = req.body;
    
    const admin = await Admin.findById(req.admin).populate("organization");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });
    
    const organization = await Organization.findById(admin.organization._id);
    if (!organization) return res.status(404).json({ msg: "Organization not found" });
    
    // Check if new orgCode already exists (if changing)
    if (orgCode && orgCode !== organization.orgCode) {
      const orgExists = await Organization.findOne({ orgCode });
      if (orgExists) return res.status(400).json({ msg: "Organization code already in use" });
      organization.orgCode = orgCode;
    }
    
    organization.name = name || organization.name;
    
    await organization.save();
    
    res.json({
      msg: "Organization updated successfully",
      organization: {
        name: organization.name,
        orgCode: organization.orgCode
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Admin profile management
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const admin = await Admin.findById(req.admin);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });
    
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    
    await admin.save();
    
    res.json({
      msg: "Profile updated successfully",
      admin: {
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const admin = await Admin.findById(req.admin);
    if (!admin) return res.status(404).json({ msg: "Admin not found" });
    
    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Current password is incorrect" });
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    
    await admin.save();
    
    res.json({ msg: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, organizationName, orgCode } = req.body;

    // Check if org code already exists
    const orgExists = await Organization.findOne({ orgCode });
    if (orgExists) return res.status(400).json({ msg: "Organization code already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create organization
    const newOrg = await Organization.create({ name: organizationName, orgCode });

    // Create admin
    const newAdmin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      organization: newOrg._id
    });

    res.status(201).json({ msg: "Admin registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).populate("organization");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      admin: {
        name: admin.name,
        email: admin.email,
        organization: {
          name: admin.organization.name,
          orgCode: admin.organization.orgCode
        }
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const admin = await Admin.findOne({ email }).populate('organization');
    if (!admin) {
      return res.status(404).json({ msg: "Admin not found" });
    }
    
    // Generate reset token
    const resetToken = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    // Save reset token to admin
    admin.resetToken = resetToken;
    admin.resetTokenExpiry = Date.now() + 3600000; // 1 hour
    await admin.save();
    
    // Send the password reset email
    const adminName = admin.name || 'Admin';
    await sendPasswordResetEmail(email, resetToken, adminName);
    
    res.json({ msg: "Password reset email sent successfully" });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword) {
      return res.status(400).json({ msg: "Token and new password are required" });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin || admin.resetToken !== token || admin.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ msg: "Invalid or expired reset token" });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(newPassword, salt);
    
    // Clear reset token
    admin.resetToken = undefined;
    admin.resetTokenExpiry = undefined;
    
    await admin.save();
    
    res.json({ msg: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    if (err.name === 'JsonWebTokenError') {
      return res.status(400).json({ msg: "Invalid reset token" });
    }
    res.status(500).json({ msg: "Server error" });
  }
};

// Get all complaints for admin's organization with AI insights
exports.getComplaints = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin).populate("organization");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const complaints = await Complaint.find({ organization: admin.organization._id })
      .sort({ createdAt: -1 });

    // Get AI trend analysis
    const trends = await analyzeComplaintTrends(complaints);

    res.json({
      complaints,
      aiInsights: trends,
      totalComplaints: complaints.length,
      urgentCount: complaints.filter(c => c.aiAnalysis?.severity === 'Critical' || c.aiAnalysis?.severity === 'High').length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Update complaint status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { status } = req.body;

    const admin = await Admin.findById(req.admin).populate("organization");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const complaint = await Complaint.findOne({ 
      _id: complaintId, 
      organization: admin.organization._id 
    });

    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    complaint.status = status;
    await complaint.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`complaint-${complaintId}`).emit('status-updated', {
        complaintId,
        status,
        updatedAt: complaint.updatedAt
      });
    }

    res.json({ msg: "Status updated successfully", complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Admin sends a message to complaint thread
exports.addAdminMessage = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { text, mediaUrl, mediaType } = req.body;
    const admin = await Admin.findById(req.admin).populate("organization");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const complaint = await Complaint.findOne({ _id: complaintId, organization: admin.organization._id });
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    const message = {
      sender: 'admin',
      text,
      mediaUrl,
      mediaType,
      timestamp: new Date()
    };
    complaint.messages.push(message);
    await complaint.save();

    // Emit real-time update to user
    const io = req.app.get('io');
    if (io) {
      io.to(`complaint-${complaintId}`).emit('admin-message', {
        complaintId,
        message
      });
    }

    res.json({
      msg: "Admin message sent",
      messages: complaint.messages
    });
  } catch (err) {
    console.error('Add admin message error:', err.message);
    res.status(500).json({ msg: "Internal error", error: err.message });
  }
};

// Reply to complaint with AI suggestions
exports.replyToComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { reply, useAISuggestion } = req.body;

    const admin = await Admin.findById(req.admin).populate("organization");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const complaint = await Complaint.findOne({ 
      _id: complaintId, 
      organization: admin.organization._id 
    });

    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    // Generate AI reply suggestions if requested
    let aiSuggestions = [];
    if (useAISuggestion || !reply) {
      aiSuggestions = await generateSmartReplies(
        complaint, 
        admin.organization.name
      );
    }

    complaint.adminReply = reply || aiSuggestions[0] || "Thank you for your complaint. We are reviewing this matter.";
    complaint.status = "In Progress";
    // Also push to messages array
    complaint.messages.push({
      sender: 'admin',
      text: complaint.adminReply,
      timestamp: new Date()
    });
    await complaint.save();

    // Emit real-time update
    const io = req.app.get('io');
    if (io) {
      io.to(`complaint-${complaintId}`).emit('admin-replied', {
        complaintId,
        reply: complaint.adminReply,
        status: complaint.status,
        updatedAt: complaint.updatedAt
      });
    }

    res.json({ 
      msg: "Reply sent successfully", 
      complaint,
      aiSuggestions: aiSuggestions.length > 0 ? aiSuggestions : undefined
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Get AI insights for a specific complaint
exports.getComplaintInsights = async (req, res) => {
  try {
    const { complaintId } = req.params;

    const admin = await Admin.findById(req.admin).populate("organization");
    if (!admin) return res.status(404).json({ msg: "Admin not found" });

    const complaint = await Complaint.findOne({ 
      _id: complaintId, 
      organization: admin.organization._id 
    });

    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    // Generate fresh AI suggestions
    const aiSuggestions = await generateSmartReplies(
      complaint, 
      admin.organization.name
    );

    res.json({
      complaint,
      aiSuggestions,
      insights: {
        severity: complaint.aiAnalysis?.severity,
        urgency: complaint.aiAnalysis?.urgency,
        riskScore: complaint.aiAnalysis?.riskScore,
        safetyFlags: complaint.aiAnalysis?.safetyFlags,
        priorityLevel: complaint.aiSuggestions?.priorityLevel,
        suggestedActions: complaint.aiSuggestions?.suggestedActions
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Test AI Analysis endpoint
exports.testAIAnalysis = async (req, res) => {
  try {
    const { text, category } = req.body;
    
    if (!text) {
      return res.status(400).json({ msg: "Text is required" });
    }

    console.log("🧪 Testing AI analysis with:", text);
    const analysis = await analyzeComplaint(text, category || "Other");
    
    res.json({
      originalText: text,
      category: category || "Other",
      aiAnalysis: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("Test AI Error:", err);
    res.status(500).json({ msg: "AI test failed", error: err.message });
  }
};
