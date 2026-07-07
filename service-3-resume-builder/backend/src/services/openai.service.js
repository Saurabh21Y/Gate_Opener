const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Uses OpenAI to generate structured, ATS-optimized resume content from raw form data.
 * @param {Object} formData - Raw resume form data from frontend
 * @returns {Promise<Object>} Structured resume JSON
 */
async function generateResumeContent(formData) {
  const userPrompt = `
Generate professional, ATS-optimized resume content based on this data:

PERSONAL INFO:
${JSON.stringify(formData.personalInfo, null, 2)}

EXPERIENCE:
${JSON.stringify(formData.experience, null, 2)}

EDUCATION:
${JSON.stringify(formData.education, null, 2)}

SKILLS: ${formData.skills}

SUMMARY CONTEXT: ${formData.summary || 'Not provided'}

Return a JSON object with EXACTLY this structure:
{
  "personalInfo": {
    "name": "full name",
    "email": "email",
    "phone": "phone",
    "location": "city, country",
    "linkedin": "linkedin url or empty string",
    "portfolio": "portfolio url or empty string"
  },
  "professionalSummary": "2-3 sentence compelling professional summary tailored to experience",
  "experience": [
    {
      "company": "company name",
      "position": "job title",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "current": false,
      "bullets": ["Achievement bullet point with quantified impact", "another bullet"]
    }
  ],
  "education": [
    {
      "institution": "university name",
      "degree": "degree type",
      "field": "field of study",
      "startDate": "Year",
      "endDate": "Year",
      "gpa": "GPA if provided"
    }
  ],
  "skills": {
    "technical": ["skill1", "skill2"],
    "soft": ["Leadership", "Communication"],
    "languages": []
  },
  "certifications": []
}
`;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL || 'gpt-4o',
    messages: [
      {
        role: 'system',
        content:
          'You are an expert resume writer and career coach with 10+ years of experience. Generate professional, ATS-optimized resume content. Return ONLY valid JSON.',
      },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = { generateResumeContent };
