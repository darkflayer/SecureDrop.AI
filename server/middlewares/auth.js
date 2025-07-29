const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) return res.status(401).json({ msg: "No token, access denied" });

  // Check if token starts with "Bearer "
  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.substring(7) 
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.adminId;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    res.status(401).json({ msg: "Invalid token" });
  }
};
