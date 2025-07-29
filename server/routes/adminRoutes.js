const express = require("express");
const router = express.Router();
const { 
  register, 
  login, 
  forgotPassword,
  resetPassword,
  getComplaints, 
  updateComplaintStatus, 
  replyToComplaint, 
  getComplaintInsights, 
  testAIAnalysis, 
  addAdminMessage,
  updateProfile,
  updatePassword,
  updateOrganization
} = require("../controllers/adminController");
const auth = require("../middlewares/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Test AI endpoint (no auth required for testing)
router.post("/test-ai", testAIAnalysis);

// Protected routes (require authentication)
router.get("/complaints", auth, getComplaints);
router.get("/complaints/:complaintId/insights", auth, getComplaintInsights);
router.put("/complaints/:complaintId/status", auth, updateComplaintStatus);
router.post("/complaints/:complaintId/reply", auth, replyToComplaint);
router.post("/complaints/:complaintId/message", auth, addAdminMessage);

// Admin profile management routes
router.put("/profile", auth, updateProfile);
router.put("/password", auth, updatePassword);
router.put("/organization", auth, updateOrganization);

module.exports = router;
