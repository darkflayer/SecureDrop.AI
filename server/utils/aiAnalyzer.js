const fetch = require('node-fetch');
require('dotenv').config();

const SEVERITY_RANK = { Low: 1, Medium: 2, High: 3, Critical: 4 };
const URGENCY_RANK = { Normal: 1, '24h': 2, Immediate: 3 };

function parseAIJson(responseText) {
  const cleaned = responseText
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('No JSON object found in AI response');
  }
  return JSON.parse(cleaned.slice(start, end + 1));
}

function pickHigherEnum(current, candidate, rankMap) {
  if (!rankMap[current]) return candidate || current;
  if (!rankMap[candidate]) return current;
  return rankMap[candidate] >= rankMap[current] ? candidate : current;
}

function analyzeKeywords(text) {
  const lower = text.toLowerCase();
  const flags = [];
  let severity = 'Low';
  let urgency = 'Normal';
  let sentiment = 'Neutral';
  let riskScore = 15;
  let emotionalTone = 'Neutral';
  let priorityLevel = 'Low';
  let escalationNeeded = false;

  const criticalPatterns = [
    /\b(kill myself|suicide|self[- ]?harm|want to die|end my life)\b/,
    /\b(hurt myself|cut myself)\b/,
  ];
  const highPatterns = [
    /\b(assault(?:ed)?|attack(?:ed)?|abuse(?:d)?|rape(?:d)?|molest(?:ed)?)\b/,
    /\b(harass(?:ed|ment)?|bully(?:ing)?|bully)\b/,
    /\b(torture(?:d)?|torcher|threat(?:en)?|violence|violent)\b/,
    /\b(weapon|gun|knife)\b/,
  ];
  const mediumPatterns = [
    /\b(scold(?:s|ed|ing)?|yell(?:s|ed|ing)?|shout(?:s|ed|ing)?|humiliat(?:e|ed|ing))\b/,
    /\b(unfair|discriminat(?:e|ed|ion)|fear|afraid|scared|anxiety|stressed?)\b/,
    /\b(help me|please help|frequent)\b/,
  ];

  if (criticalPatterns.some((pattern) => pattern.test(lower))) {
    severity = 'Critical';
    urgency = 'Immediate';
    sentiment = 'Negative';
    riskScore = 95;
    emotionalTone = 'Distressed';
    priorityLevel = 'High';
    escalationNeeded = true;
    flags.push('self-harm');
  } else if (highPatterns.some((pattern) => pattern.test(lower))) {
    severity = 'High';
    urgency = '24h';
    sentiment = 'Negative';
    riskScore = 82;
    emotionalTone = 'Distressed';
    priorityLevel = 'High';
    escalationNeeded = true;
    if (/\b(assault|attack|violence|torture|torcher|weapon)\b/.test(lower)) flags.push('violence');
    if (/\b(harass|bully)\b/.test(lower)) flags.push('harassment');
    if (/\b(abuse|rape|molest)\b/.test(lower)) flags.push('abuse');
  } else if (mediumPatterns.some((pattern) => pattern.test(lower))) {
    severity = 'Medium';
    urgency = '24h';
    sentiment = 'Negative';
    riskScore = 48;
    emotionalTone = 'Upset';
    priorityLevel = 'Medium';
    escalationNeeded = false;
  }

  return {
    severity,
    urgency,
    sentiment,
    safetyFlags: flags,
    riskScore,
    emotionalTone,
    priorityLevel,
    suggestedActions: buildSuggestedActions(severity, flags),
    escalationNeeded,
    replyTemplates: buildReplyTemplates(severity, flags),
  };
}

function buildSuggestedActions(severity, flags) {
  if (severity === 'Critical') {
    return ['Immediate welfare check', 'Contact emergency services if required', 'Escalate to senior admin'];
  }
  if (severity === 'High') {
    return ['Launch formal investigation within 24h', 'Interview involved parties', 'Offer support resources'];
  }
  if (flags.includes('harassment') || flags.includes('abuse')) {
    return ['Document incident details', 'Contact HR/compliance', 'Follow up with complainant within 24h'];
  }
  return ['Review complaint', 'Respond within 24 hours'];
}

function buildReplyTemplates(severity, flags) {
  if (severity === 'Critical' || severity === 'High') {
    return [
      'We take this report very seriously and have escalated it for immediate review.',
      'Thank you for reporting this. A senior administrator will contact you within 24 hours.',
      'Your safety is our priority. We are investigating this matter urgently.',
    ];
  }
  if (flags.includes('harassment') || flags.includes('abuse') || flags.includes('violence')) {
    return [
      'We understand how difficult this must be. This complaint has been escalated for investigation.',
      'Thank you for sharing this. Our team will review the details and follow up shortly.',
      'We are committed to addressing this issue and will keep you updated on next steps.',
    ];
  }
  return [
    'Thank you for bringing this to our attention. We are reviewing your complaint.',
    'We understand your concern and are investigating this matter.',
    'This has been escalated to the appropriate department for review.',
  ];
}

function mergeAnalysis(aiResult, keywordResult) {
  const merged = {
    severity: pickHigherEnum(aiResult.severity, keywordResult.severity, SEVERITY_RANK),
    urgency: pickHigherEnum(aiResult.urgency, keywordResult.urgency, URGENCY_RANK),
    sentiment: aiResult.sentiment === 'Neutral' && keywordResult.sentiment !== 'Neutral'
      ? keywordResult.sentiment
      : (aiResult.sentiment || keywordResult.sentiment),
    safetyFlags: [...new Set([...(aiResult.safetyFlags || []), ...(keywordResult.safetyFlags || [])])],
    riskScore: Math.max(Number(aiResult.riskScore) || 0, keywordResult.riskScore),
    emotionalTone: aiResult.emotionalTone || keywordResult.emotionalTone,
    priorityLevel: pickHigherEnum(aiResult.priorityLevel, keywordResult.priorityLevel, SEVERITY_RANK),
    suggestedActions: (aiResult.suggestedActions?.length ? aiResult.suggestedActions : keywordResult.suggestedActions),
    escalationNeeded: Boolean(aiResult.escalationNeeded || keywordResult.escalationNeeded),
    replyTemplates: (aiResult.replyTemplates?.length ? aiResult.replyTemplates : keywordResult.replyTemplates),
  };

  if (merged.riskScore >= 80) {
    merged.severity = pickHigherEnum(merged.severity, 'High', SEVERITY_RANK);
    merged.urgency = pickHigherEnum(merged.urgency, '24h', URGENCY_RANK);
    merged.escalationNeeded = true;
  }
  if (merged.riskScore >= 90) {
    merged.severity = 'Critical';
    merged.urgency = 'Immediate';
  }

  return merged;
}

function normalizeAnalysis(raw) {
  const validSeverities = ['Low', 'Medium', 'High', 'Critical'];
  const validUrgencies = ['Normal', '24h', 'Immediate'];
  const validSentiments = ['Positive', 'Neutral', 'Negative', 'Angry'];

  return {
    severity: validSeverities.includes(raw.severity) ? raw.severity : 'Medium',
    urgency: validUrgencies.includes(raw.urgency) ? raw.urgency : 'Normal',
    sentiment: validSentiments.includes(raw.sentiment) ? raw.sentiment : 'Neutral',
    safetyFlags: Array.isArray(raw.safetyFlags) ? raw.safetyFlags : [],
    riskScore: Math.min(100, Math.max(0, Number(raw.riskScore) || 20)),
    emotionalTone: raw.emotionalTone || 'Neutral',
    priorityLevel: validSeverities.includes(raw.priorityLevel) ? raw.priorityLevel : raw.severity || 'Medium',
    suggestedActions: Array.isArray(raw.suggestedActions) && raw.suggestedActions.length
      ? raw.suggestedActions
      : ['Review complaint', 'Respond within 24 hours'],
    escalationNeeded: Boolean(raw.escalationNeeded),
    replyTemplates: Array.isArray(raw.replyTemplates) && raw.replyTemplates.length
      ? raw.replyTemplates
      : buildReplyTemplates(raw.severity || 'Medium', raw.safetyFlags || []),
  };
}

async function analyzeComplaint(text, category) {
  const keywordAnalysis = analyzeKeywords(text);

  try {
    console.log(`🤖 Starting AI analysis for: "${text.substring(0, 50)}..."`);

    const prompt = `You are a school/workplace complaint triage expert. Analyze the complaint and return ONLY valid JSON.

Category: ${category}
Complaint: ${text}

Scoring rules:
- Physical assault, abuse, torture, threats, weapons => severity "High" or "Critical", urgency "24h" or "Immediate", sentiment "Negative" or "Angry", riskScore 75-95
- Harassment, bullying, repeated verbal abuse by authority figures => severity "High", urgency "24h", riskScore 65-85
- Stress, unfair treatment, frequent scolding => severity "Medium", urgency "24h", riskScore 40-60
- Minor technical/logistics issues => severity "Low", urgency "Normal", riskScore 5-20
- Words like "assaulted", "torture", "abuse", "help me" indicate distress, never "Neutral" sentiment

Return exactly this JSON shape:
{
  "severity": "Low|Medium|High|Critical",
  "urgency": "Normal|24h|Immediate",
  "sentiment": "Positive|Neutral|Negative|Angry",
  "safetyFlags": [],
  "riskScore": 0,
  "emotionalTone": "string",
  "priorityLevel": "Low|Medium|High",
  "suggestedActions": ["action1"],
  "escalationNeeded": false,
  "replyTemplates": ["template1", "template2", "template3"]
}`;

    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    const model = 'openrouter/owl-alpha';
    let lastError = null;

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`OpenRouter API attempt ${attempt}...`);
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${openRouterKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model,
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 1024,
            temperature: 0.2,
          }),
        });

        const data = await res.json();
        if (data.choices?.[0]?.message?.content) {
          const responseText = data.choices[0].message.content.trim();
          const analysis = normalizeAnalysis(parseAIJson(responseText));
          const merged = mergeAnalysis(analysis, keywordAnalysis);
          console.log('✅ AI Analysis successful:', merged);
          return merged;
        }

        lastError = data.error ? data.error.message : 'No valid response from OpenRouter';
        console.error(`OpenRouter attempt ${attempt} failed:`, lastError);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
      } catch (err) {
        lastError = err.message;
        console.error(`OpenRouter attempt ${attempt} exception:`, lastError);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }

    throw new Error(`No valid response from OpenRouter after 3 attempts: ${lastError}`);
  } catch (err) {
    console.error('❌ AI Analysis Error:', err.message);
    const fallback = getIntelligentDefault(text, category);
    const merged = mergeAnalysis(fallback, keywordAnalysis);
    console.log('🔄 Using keyword-enhanced fallback:', merged);
    return merged;
  }
}

function getIntelligentDefault(text, category) {
  const keywordAnalysis = analyzeKeywords(text);
  if (keywordAnalysis.riskScore > 15) {
    return keywordAnalysis;
  }

  const lowerText = text.toLowerCase();

  if (lowerText.includes('harass') || lowerText.includes('bully')) {
    return {
      severity: 'High',
      urgency: '24h',
      sentiment: 'Negative',
      safetyFlags: ['harassment'],
      riskScore: 75,
      emotionalTone: 'Distressed',
      priorityLevel: 'High',
      suggestedActions: ['Immediate investigation', 'Contact HR', 'Provide support resources'],
      escalationNeeded: true,
      replyTemplates: buildReplyTemplates('High', ['harassment']),
    };
  }

  if (lowerText.includes('stress') || lowerText.includes('overwhelm') || lowerText.includes('anxiety')) {
    return {
      severity: 'Medium',
      urgency: '24h',
      sentiment: 'Negative',
      safetyFlags: [],
      riskScore: 40,
      emotionalTone: 'Stressed',
      priorityLevel: 'Medium',
      suggestedActions: ['Offer counseling resources', 'Check academic support', 'Follow up within 24h'],
      escalationNeeded: false,
      replyTemplates: buildReplyTemplates('Medium', []),
    };
  }

  if (lowerText.includes('wifi') || lowerText.includes('technical') || lowerText.includes('login')) {
    return {
      severity: 'Low',
      urgency: 'Normal',
      sentiment: 'Neutral',
      safetyFlags: [],
      riskScore: 10,
      emotionalTone: 'Frustrated',
      priorityLevel: 'Low',
      suggestedActions: ['Contact IT support', 'Provide troubleshooting steps'],
      escalationNeeded: false,
      replyTemplates: buildReplyTemplates('Low', []),
    };
  }

  return {
    severity: category === 'Mental Health' ? 'Medium' : 'Medium',
    urgency: 'Normal',
    sentiment: 'Neutral',
    safetyFlags: [],
    riskScore: 20,
    emotionalTone: 'Neutral',
    priorityLevel: 'Medium',
    suggestedActions: ['Review complaint', 'Respond within 24 hours'],
    escalationNeeded: false,
    replyTemplates: buildReplyTemplates('Medium', []),
  };
}

async function findSimilarComplaints() {
  return [];
}

async function generateSmartReplies(complaint) {
  return complaint.aiSuggestions?.replyTemplates || buildReplyTemplates(
    complaint.aiAnalysis?.severity || 'Medium',
    complaint.aiAnalysis?.safetyFlags || []
  );
}

async function analyzeComplaintTrends(complaints) {
  const categoryMap = {};
  complaints.forEach((c) => {
    categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
  });
  const topIssues = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cat, count]) => `${cat} (${count} complaints)`);

  return {
    topIssues: topIssues.length ? topIssues : ['General complaints'],
    sentimentTrend: 'Stable',
    urgentMatters: complaints
      .filter((c) => ['High', 'Critical'].includes(c.aiAnalysis?.severity))
      .slice(0, 3)
      .map((c) => c.message?.substring(0, 80) || 'Urgent complaint'),
    recommendations: ['Improve response time', 'Prioritize high-severity cases', 'Review recurring categories'],
    responseTime: '24 hours',
    satisfactionTrend: 'Stable',
  };
}

module.exports = {
  analyzeComplaint,
  findSimilarComplaints,
  generateSmartReplies,
  analyzeComplaintTrends,
  analyzeKeywords,
};
