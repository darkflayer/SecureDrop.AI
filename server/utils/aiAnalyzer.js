const fetch = require('node-fetch');
require('dotenv').config();

// Enhanced AI Analysis for Complaints
async function analyzeComplaint(text, category) {
  try {
    console.log(`🤖 Starting AI analysis for: "${text.substring(0, 50)}..."`);
    
    const prompt = `
    Analyze this complaint and return ONLY a valid JSON object with this exact structure:
    
    {
      "severity": "Low",
      "urgency": "Normal", 
      "sentiment": "Neutral",
      "safetyFlags": [],
      "riskScore": 0,
      "emotionalTone": "description",
      "priorityLevel": "Low",
      "suggestedActions": ["action1"],
      "escalationNeeded": false,
      "replyTemplates": ["template1", "template2", "template3"]
    }
    
    Analysis Rules:
    - Severity: "Low" for minor issues, "Medium" for moderate, "High" for serious, "Critical" for life-threatening
    - Urgency: "Normal" for routine, "24h" for urgent, "Immediate" for emergency
    - Sentiment: "Positive", "Neutral", "Negative", or "Angry"
    - Safety Flags: Array of flags like ["harassment", "threats", "self-harm", "violence"]
    - Risk Score: Number 0-100 (0=safe, 100=critical)
    - Priority: "Low", "Medium", or "High"
    
    Examples:
    - "I'm stressed with studies" → severity: "Medium", urgency: "Normal", sentiment: "Negative"
    - "I was harassed" → severity: "High", urgency: "24h", sentiment: "Negative", safetyFlags: ["harassment"]
    - "I want to hurt myself" → severity: "Critical", urgency: "Immediate", sentiment: "Negative", safetyFlags: ["self-harm"]
    
    Complaint Category: ${category}
    Complaint Text: ${text}
    
    Return ONLY the JSON object, no other text.
    `;

    console.log("📤 Sending request to OpenRouter AI...");
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    const model = "mistralai/mistral-7b-instruct"; // Switched to a different free model
    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`OpenRouter API attempt ${attempt}...`);
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1024
          })
        });
        const data = await res.json();
        console.log("OpenRouter raw response:", JSON.stringify(data, null, 2));
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
          const responseText = data.choices[0].message.content.trim();
          console.log("📥 Raw AI Response:", responseText.substring(0, 200) + "...");
          const analysis = JSON.parse(responseText);
          console.log("✅ AI Analysis successful:", analysis);
          return analysis;
        } else {
          lastError = data.error ? data.error.message : 'No valid response from OpenRouter';
          console.error(`OpenRouter attempt ${attempt} failed:`, lastError);
          if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt)); // Backoff
        }
      } catch (err) {
        lastError = err.message;
        console.error(`OpenRouter attempt ${attempt} exception:`, lastError);
        if (attempt < 3) await new Promise(r => setTimeout(r, 1000 * attempt)); // Backoff
      }
    }
    throw new Error('No valid response from OpenRouter after 3 attempts: ' + lastError);

  } catch (err) {
    console.error("❌ AI Analysis Error:", err.message);
    console.error("Error details:", err);
    
    // Return intelligent default based on category and text
    const defaultAnalysis = getIntelligentDefault(text, category);
    console.log("🔄 Using intelligent default:", defaultAnalysis);
    
    return defaultAnalysis;
  }
}

// Intelligent default analysis based on content
function getIntelligentDefault(text, category) {
  const lowerText = text.toLowerCase();
  
  // Check for high-priority keywords
  if (lowerText.includes('harass') || lowerText.includes('bully')) {
    return {
      severity: "High",
      urgency: "24h",
      sentiment: "Negative",
      safetyFlags: ["harassment"],
      riskScore: 75,
      emotionalTone: "Distressed",
      priorityLevel: "High",
      suggestedActions: ["Immediate investigation", "Contact HR", "Provide support resources"],
      escalationNeeded: true,
      replyTemplates: [
        "We take harassment complaints very seriously. This has been escalated to our HR department for immediate investigation.",
        "Thank you for reporting this. We are launching an investigation and will contact you within 24 hours.",
        "This matter requires immediate attention. Our HR team will reach out to you today."
      ]
    };
  }
  
  if (lowerText.includes('stress') || lowerText.includes('overwhelm') || lowerText.includes('anxiety')) {
    return {
      severity: "Medium",
      urgency: "24h",
      sentiment: "Negative",
      safetyFlags: [],
      riskScore: 40,
      emotionalTone: "Stressed",
      priorityLevel: "Medium",
      suggestedActions: ["Offer counseling resources", "Check academic support", "Follow up within 24h"],
      escalationNeeded: false,
      replyTemplates: [
        "We understand that academic stress can be overwhelming. Our counseling center is available to support you.",
        "Thank you for sharing your concerns. We have resources available to help with academic stress.",
        "Your well-being is important to us. Please consider reaching out to our student support services."
      ]
    };
  }
  
  if (lowerText.includes('wifi') || lowerText.includes('technical') || lowerText.includes('login')) {
    return {
      severity: "Low",
      urgency: "Normal",
      sentiment: "Neutral",
      safetyFlags: [],
      riskScore: 10,
      emotionalTone: "Frustrated",
      priorityLevel: "Low",
      suggestedActions: ["Contact IT support", "Provide troubleshooting steps"],
      escalationNeeded: false,
      replyTemplates: [
        "We're sorry for the technical difficulties. Our IT team has been notified.",
        "Thank you for reporting this issue. We're working to resolve it as quickly as possible.",
        "We understand technical issues can be frustrating. Our support team will assist you."
      ]
    };
  }
  
  // Default for other cases
  return {
    severity: "Medium",
    urgency: "Normal",
    sentiment: "Neutral",
    safetyFlags: [],
    riskScore: 20,
    emotionalTone: "Neutral",
    priorityLevel: "Medium",
    suggestedActions: ["Review complaint", "Respond within 24 hours"],
    escalationNeeded: false,
    replyTemplates: [
      "Thank you for bringing this to our attention. We are reviewing your complaint.",
      "We understand your concern and are investigating this matter.",
      "This has been escalated to the appropriate department for review."
    ]
  };
}

// Find Similar Complaints
async function findSimilarComplaints(newComplaint, existingComplaints) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    Compare this new complaint with existing complaints and find similar ones.
    Return a JSON array of complaint IDs that are >70% similar.
    
    New Complaint: ${newComplaint.message}
    Category: ${newComplaint.category}
    
    Existing Complaints: ${JSON.stringify(existingComplaints.slice(0, 10))}
    
    Return format: ["complaintId1", "complaintId2"]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const similarIds = JSON.parse(response.text().trim());
    
    return similarIds;
  } catch (err) {
    console.error("Similar Complaints Error:", err);
    return [];
  }
}

// Generate Smart Reply Suggestions
async function generateSmartReplies(complaint, orgContext) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    Generate 3 professional reply templates for this complaint.
    Consider the category, severity, and organization context.
    
    Complaint: ${complaint.message}
    Category: ${complaint.category}
    Severity: ${complaint.aiAnalysis?.severity || 'Medium'}
    Organization: ${orgContext}
    
    Generate:
    1. Immediate acknowledgment (professional, empathetic)
    2. Detailed response (addressing specific concerns)
    3. Escalation template (if needed)
    
    Return as JSON array: ["reply1", "reply2", "reply3"]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const replies = JSON.parse(response.text().trim());
    
    return replies;
  } catch (err) {
    console.error("Smart Replies Error:", err);
    return [
      "Thank you for your complaint. We are reviewing this matter.",
      "We understand your concern and will investigate this issue.",
      "This has been escalated to the appropriate department."
    ];
  }
}

// Analyze Trends and Patterns
async function analyzeComplaintTrends(complaints) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
    Analyze these complaints and provide insights:
    
    Complaints: ${JSON.stringify(complaints.slice(0, 20))}
    
    Return JSON with:
    {
      "topIssues": ["issue1", "issue2", "issue3"],
      "sentimentTrend": "Improving/Declining/Stable",
      "urgentMatters": ["urgent1", "urgent2"],
      "recommendations": ["rec1", "rec2", "rec3"],
      "responseTime": "avg hours",
      "satisfactionTrend": "Improving/Declining/Stable"
    }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const trends = JSON.parse(response.text().trim());
    
    return trends;
  } catch (err) {
    console.error("Trend Analysis Error:", err);
    return {
      topIssues: ["General complaints", "Technical issues"],
      sentimentTrend: "Stable",
      urgentMatters: [],
      recommendations: ["Improve response time", "Enhance communication"],
      responseTime: "24 hours",
      satisfactionTrend: "Stable"
    };
  }
}

module.exports = {
  analyzeComplaint,
  findSimilarComplaints,
  generateSmartReplies,
  analyzeComplaintTrends
}; 