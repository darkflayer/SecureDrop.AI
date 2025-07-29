// utils/ruleBasedCategorizer.js
function getCategoryFromRules(text) {
    const lower = text.toLowerCase();
  
    if (lower.includes("harass") || lower.includes("bully")) return "Harassment";
    if (lower.includes("wifi") || lower.includes("login") || lower.includes("technical"))
      return "Technical Issue";
    if (lower.includes("exam") || lower.includes("teacher") || lower.includes("attendance"))
      return "Academic";
    if (lower.includes("fees") || lower.includes("payment")) return "Finance";
    if (lower.includes("depression") || lower.includes("anxiety") || lower.includes("stress"))
      return "Mental Health";
  
    return "Other";
  }
  
  module.exports = { getCategoryFromRules };
  