const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { submitComplaint, trackComplaint, addUserMessage } = require("../controllers/complaintController");
const { searchOrganizations } = require("../controllers/organizationController");

router.post("/submit", upload, submitComplaint);
router.get("/track/:complaintId", trackComplaint);
router.post("/:complaintId/message", addUserMessage);

// Organization search endpoint
router.get("/organizations", searchOrganizations);

module.exports = router;
