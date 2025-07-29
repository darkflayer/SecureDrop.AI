const Organization = require("../models/Organization");

// GET /api/complaint/organizations?search=...
exports.searchOrganizations = async (req, res) => {
  try {
    const { search } = req.query;
    if (!search || typeof search !== 'string' || !search.trim()) {
      return res.status(400).json({ msg: "Search query is required" });
    }
    const regex = new RegExp(search.trim(), 'i');
    const orgs = await Organization.find({
      $or: [
        { name: regex },
        { orgCode: regex }
      ]
    }).select('name orgCode');
    res.json(orgs);
  } catch (err) {
    console.error('Organization search error:', err.message);
    res.status(500).json({ msg: "Internal error", error: err.message });
  }
}; 