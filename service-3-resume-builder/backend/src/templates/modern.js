/**
 * Modern Resume Template
 * Two-column layout: sidebar (contact/skills) + main (experience/education)
 * Color: Indigo/Purple accent with clean sans-serif typography
 * ATS-friendly structure with semantic HTML
 */
function generateHTML(data) {
  const { personalInfo, professionalSummary, experience, education, skills, certifications } = data;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${personalInfo.name} — Resume</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; color: #1a1a2e; font-size: 13px; line-height: 1.5; background: white; }
  .container { display: flex; min-height: 100vh; }
  .sidebar { width: 240px; background: #1e1b4b; color: white; padding: 32px 24px; flex-shrink: 0; }
  .main { flex: 1; padding: 32px 36px; }
  .name { font-size: 22px; font-weight: 700; color: white; line-height: 1.2; margin-bottom: 4px; }
  .position-title { color: #a5b4fc; font-size: 12px; font-weight: 500; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.05em; }
  .sidebar-section { margin-bottom: 24px; }
  .sidebar-heading { color: #a5b4fc; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; }
  .contact-item { color: rgba(255,255,255,0.8); font-size: 12px; margin-bottom: 8px; word-break: break-word; }
  .contact-label { color: #a5b4fc; font-size: 10px; display: block; margin-bottom: 2px; }
  .skill-tag { display: inline-block; background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.9); padding: 3px 8px; border-radius: 12px; font-size: 11px; margin: 2px 2px 2px 0; }
  .section { margin-bottom: 28px; }
  .section-heading { font-size: 16px; font-weight: 700; color: #1e1b4b; border-left: 4px solid #6366f1; padding-left: 12px; margin-bottom: 16px; }
  .summary-text { color: #374151; line-height: 1.7; font-size: 13px; }
  .exp-item { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f3f4f6; }
  .exp-item:last-child { border-bottom: none; }
  .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
  .exp-company { font-weight: 700; color: #1a1a2e; font-size: 14px; }
  .exp-date { color: #6366f1; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .exp-position { color: #6366f1; font-size: 12px; font-weight: 600; margin-bottom: 8px; }
  .exp-bullets { padding-left: 16px; }
  .exp-bullets li { color: #374151; margin-bottom: 4px; font-size: 12px; }
  .edu-item { margin-bottom: 14px; }
  .edu-degree { font-weight: 700; color: #1a1a2e; font-size: 13px; }
  .edu-school { color: #6366f1; font-size: 12px; }
  .edu-date { color: #9ca3af; font-size: 11px; }
  @media print { body { font-size: 12px; } .container { min-height: auto; } }
</style>
</head>
<body>
<div class="container">
  <div class="sidebar">
    <div class="name">${personalInfo.name}</div>
    <div class="position-title">${experience?.[0]?.position || 'Professional'}</div>

    <div class="sidebar-section">
      <div class="sidebar-heading">Contact</div>
      <div class="contact-item"><span class="contact-label">Email</span>${personalInfo.email}</div>
      <div class="contact-item"><span class="contact-label">Phone</span>${personalInfo.phone}</div>
      <div class="contact-item"><span class="contact-label">Location</span>${personalInfo.location}</div>
      ${personalInfo.linkedin ? `<div class="contact-item"><span class="contact-label">LinkedIn</span>${personalInfo.linkedin}</div>` : ''}
      ${personalInfo.portfolio ? `<div class="contact-item"><span class="contact-label">Portfolio</span>${personalInfo.portfolio}</div>` : ''}
    </div>

    ${
      skills?.technical?.length
        ? `<div class="sidebar-section">
      <div class="sidebar-heading">Technical Skills</div>
      ${skills.technical.map((s) => `<span class="skill-tag">${s}</span>`).join('')}
    </div>`
        : ''
    }

    ${
      skills?.soft?.length
        ? `<div class="sidebar-section">
      <div class="sidebar-heading">Soft Skills</div>
      ${skills.soft.map((s) => `<span class="skill-tag">${s}</span>`).join('')}
    </div>`
        : ''
    }

    ${
      certifications?.length
        ? `<div class="sidebar-section">
      <div class="sidebar-heading">Certifications</div>
      ${certifications.map((c) => `<div class="contact-item"><strong>${c.name}</strong><br/>${c.issuer}, ${c.date}</div>`).join('')}
    </div>`
        : ''
    }
  </div>

  <div class="main">
    ${
      professionalSummary
        ? `<div class="section">
      <div class="section-heading">Professional Summary</div>
      <p class="summary-text">${professionalSummary}</p>
    </div>`
        : ''
    }

    ${
      experience?.length
        ? `<div class="section">
      <div class="section-heading">Work Experience</div>
      ${experience
        .map(
          (exp) => `
        <div class="exp-item">
          <div class="exp-header">
            <div class="exp-company">${exp.company}</div>
            <div class="exp-date">${exp.startDate} — ${exp.endDate}</div>
          </div>
          <div class="exp-position">${exp.position}</div>
          <ul class="exp-bullets">
            ${(exp.bullets || []).map((b) => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      `
        )
        .join('')}
    </div>`
        : ''
    }

    ${
      education?.length
        ? `<div class="section">
      <div class="section-heading">Education</div>
      ${education
        .map(
          (edu) => `
        <div class="edu-item">
          <div class="edu-degree">${edu.degree} in ${edu.field}</div>
          <div class="edu-school">${edu.institution}</div>
          <div class="edu-date">${edu.startDate} — ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}</div>
        </div>
      `
        )
        .join('')}
    </div>`
        : ''
    }
  </div>
</div>
</body>
</html>`;
}

module.exports = { generateHTML };
