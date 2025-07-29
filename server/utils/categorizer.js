const { getCategoryFromRules } = require("./ruleBasedCategorizer");
const { callMistralAPI } = require("./mistral");

async function categorizeComplaint(text) {
  const ruleCategory = getCategoryFromRules(text);
  if (ruleCategory !== "Other") return ruleCategory;

  const aiCategory = await callMistralAPI(text);
  return aiCategory;
}

module.exports = { categorizeComplaint };
