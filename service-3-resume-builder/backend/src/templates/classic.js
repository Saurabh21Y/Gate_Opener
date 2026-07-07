/**
 * Classic Resume Template
 * Traditional single-column layout with serif typography
 * Conservative dark gray colors, centered name header, horizontal dividers
 * Perfect ATS compatibility
 */
function generateHTML(data) {
  const { personalInfo, professionalSummary, experience, education, skills, certifications } = data;
  const allSkills = [...(skills?.technical || []), ...(skills?.soft || []), ...(skills?.languages || [])];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${personalInfo.name} — Resume</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Times New Roman', Times, Georgia, serif; color: #1a1a1a; font-size: 12pt; line-height: 1.5; background: white; padding: 48px 56px; max-width: 850px; margin: 0 auto; }
  .header { text-align: center; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 2px solid #1a1a1a; }
  .name { font-size: 28pt; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #1a1a1a; margin-bottom: 8px; }
  .contact-line { font-size: 10pt; color: #333; }
  .contact-sep { margin: 0 8px; color: #999; }
  .section { margin-bottom: 20px; }
  .section-heading { font-size: 12pt; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #1a1a1a; border-bottom: 1px solid #333; padding-bottom: 4px; margin-bottom: 12px; }
  .summary-text { font-size: 11pt; color: #333; line-height: 1.7; }
  .exp-item { margin-bottom: 14px; }
  .exp-header { display: flex; justify-content: space-between; }
  .exp-company { font-weight: 700; font-size: 11pt; }
  .exp-date { font-size: 10pt; color: #555; }
  .exp-position { font-style: italic; color: #444; font-size: 11pt; margin-bottom: 6px; }
  .exp-bullets { padding-left: 20px; margin-top: 4px; }
  .exp-bullets li { color: #333; margin-bottom: 3px; font-size: 11pt; }
  .edu-item { margin-bottom: 12px; }
  .edu-header { display: flex; justify-content: space-between; }
  .edu-degree { font-weight: 700; font-size: 11pt; }
  .edu-date { color: #555; font-size: 10pt; }
  .edu-school { color: #444; font-style: italic; }
  .skills-list { color: #333; font-size: 11pt; line-height: 1.8; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="header">
    <div class="name">${personalInfo.name}</div>
    <div class="contact-line">
      ${personalInfo.email}<span class="contact-sep">|</span>
      ${personalInfo.phone}<span class="contact-sep">|</span>
      ${personalInfo.location}
      ${personalInfo.linkedin ? `<span class="contact-sep">|</span>${personalInfo.linkedin}` : ''}
      ${personalInfo.portfolio ? `<span class="contact-sep">|</span>${personalInfo.portfolio}` : ''}
    </div>
  </div>

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
    <div class="section-heading">Professional Experience</div>
    ${experience
      .map(
        (exp) => `
      <div class="exp-item">
        <div class="exp-header"><div class="exp-company">${exp.company}</div><div class="exp-date">${exp.startDate} – ${exp.endDate}</div></div>
        <div class="exp-position">${exp.position}</div>
        <ul class="exp-bullets">${(exp.bullets || []).map((b) => `<li>${b}</li>`).join('')}</ul>
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
        <div class="edu-header"><div class="edu-degree">${edu.degree} in ${edu.field}</div><div class="edu-date">${edu.startDate} – ${edu.endDate}</div></div>
        <div class="edu-school">${edu.institution}${edu.gpa ? ` — GPA: ${edu.gpa}` : ''}</div>
      </div>
    `
      )
      .join('')}
  </div>`
      : ''
  }

  ${
    allSkills.length
      ? `<div class="section">
    <div class="section-heading">Skills</div>
    <div class="skills-list">${allSkills.join(' • ')}</div>
  </div>`
      : ''
  }

  ${
    certifications?.length
      ? `<div class="section">
    <div class="section-heading">Certifications</div>
    ${certifications.map((c) => `<div class="edu-item"><div class="edu-degree">${c.name}</div><div class="edu-school">${c.issuer} — ${c.date}</div></div>`).join('')}
  </div>`
      : ''
  }
</body>
</html>`;
}

module.exports = { generateHTML };
