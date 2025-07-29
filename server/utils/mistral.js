// utils/mistral.js
const fetch = require('node-fetch');
require('dotenv').config();

async function callMistralAPI(text) {
  try {
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const model = "mistralai/mistral-7b-instruct";
    const prompt = `Classify the following complaint into one of the categories: [Harassment, Technical Issue, Academic, Finance, Mental Health, Other]. Respond only with the category name.\n\nComplaint:\n${text}`;
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 128
      })
    });
    const data = await res.json();
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content.trim();
    } else {
      console.error("OpenRouter Error:", data.error ? data.error.message : 'No valid response');
      return "Other";
    }
  } catch (err) {
    console.error("OpenRouter Exception:", err);
    return "Other";
  }
}

module.exports = { callMistralAPI };
