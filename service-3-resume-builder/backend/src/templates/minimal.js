/**
 * Minimal Resume Template
 * Ultra-clean, maximum whitespace, black and white with gray accents
 * Helvetica/Arial sans-serif, modern dot separators
 * Highly ATS-friendly
 */
function generateHTML(data) {
  const { personalInfo, professionalSummary, experience, education, skills, certifications } = data;
  const allSkills = [...(skills?.technical || []), ...(skills?.soft || []), ...(skills?.languages || [])];

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${personalInfo.name}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Helvetica, Arial, sans-serif; color: #111; font-size: 13px; line-height: 1.6; background: white; padding: 52px 60px; max-width: 820px; margin: 0 auto; }
  .name { font-size: 32px; font-weight: 300; letter-spacing: -0.5px; color: #000; margin-bottom: 8px; }
  .contact-line { font-size: 12px; color: #555; margin-bottom: 32px; }
  .contact-dot { margin: 0 8px; color: #bbb; }
  hr { border: none; border-top: 1px solid #e5e5e5; margin: 24px 0; }
  .section-heading { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #999; margin-bottom: 16px; }
  .summary-text { color: #333; line-height: 1.8; font-size: 13px; font-weight: 300; }
  .exp-item { margin-bottom: 20px; }
  .exp-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 2px; }
  .exp-company { font-weight: 600; font-size: 14px; color: #000; }
  .exp-date { font-size: 11px; color: #999; }
  .exp-position { color: #666; font-size: 12px; margin-bottom: 8px; font-style: italic; }
  .exp-bullets { list-style: none; padding: 0; }
  .exp-bullets li { color: #444; padding-left: 12px; position: relative; margin-bottom: 4px; font-size: 12px; }
  .exp-bullets li::before { content: '–'; position: absolute; left: 0; color: #bbb; }
  .edu-item { margin-bottom: 12px; }
  .edu-degree { font-weight: 600; color: #000; }
  .edu-school { color: #666; font-size: 12px; }
  .edu-date { color: #999; font-size: 11px; }
  .skills-wrap { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-chip { border: 1px solid #ddd; padding: 4px 12px; border-radius: 2px; font-size: 11px; color: #444; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <div class="name">${personalInfo.name}</div>
  <div class="contact-line">
    ${personalInfo.email}
    <span class="contact-dot">·</span>${personalInfo.phone}
    <span class="contact-dot">·</span>${personalInfo.location}
    ${personalInfo.linkedin ? `<span class="contact-dot">·</span>${personalInfo.linkedin}` : ''}
    ${personalInfo.portfolio ? `<span class="contact-dot">·</span>${personalInfo.portfolio}` : ''}
  </div>

  ${professionalSummary ? `<div class="section-heading">About</div><p class="summary-text">${professionalSummary}</p><hr>` : ''}

  ${
    experience?.length
      ? `<div class="section-heading">Experience</div>
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
    <hr>`
      : ''
  }

  ${
    education?.length
      ? `<div class="section-heading">Education</div>
    ${education
      .map(
        (edu) => `
      <div class="edu-item">
        <div class="edu-degree">${edu.degree} in ${edu.field}</div>
        <div class="edu-school">${edu.institution}</div>
        <div class="edu-date">${edu.startDate} – ${edu.endDate}${edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
      </div>
    `
      )
      .join('')}
    <hr>`
      : ''
  }

  ${
    allSkills.length
      ? `<div class="section-heading">Skills</div>
    <div class="skills-wrap">${allSkills.map((s) => `<span class="skill-chip">${s}</span>`).join('')}</div>`
      : ''
  }

  ${
    certifications?.length
      ? `<hr><div class="section-heading">Certifications</div>
    ${certifications.map((c) => `<div class="edu-item"><div class="edu-degree">${c.name}</div><div class="edu-school">${c.issuer} · ${c.date}</div></div>`).join('')}`
      : ''
  }
</body>
</html>`;
}

module.exports = { generateHTML };
