const modern = require('../templates/modern');
const classic = require('../templates/classic');
const minimal = require('../templates/minimal');

const templates = { modern, classic, minimal };

/**
 * Renders resume data into an HTML string using the specified template.
 * @param {Object} generatedData - Structured resume data from OpenAI
 * @param {string} templateName - 'modern' | 'classic' | 'minimal'
 * @returns {string} Full HTML document
 */
function renderTemplate(generatedData, templateName = 'modern') {
  const template = templates[templateName];
  if (!template) throw new Error(`Unknown template: ${templateName}`);
  return template.generateHTML(generatedData);
}

module.exports = { renderTemplate };
