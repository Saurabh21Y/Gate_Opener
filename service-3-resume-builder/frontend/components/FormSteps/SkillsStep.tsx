import { Template } from '@/lib/types';

interface Props {
  skills: string;
  summary: string;
  template: Template;
  onSkillsChange: (v: string) => void;
  onSummaryChange: (v: string) => void;
  onTemplateChange: (t: Template) => void;
}

const TEMPLATES: Array<{
  id: Template;
  name: string;
  desc: string;
  color: string;
  icon: string;
  preview: string;
}> = [
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Two-column layout with indigo sidebar. Eye-catching yet professional.',
    color: '#6366f1',
    icon: '🎨',
    preview: 'Two-column • Sans-serif • Indigo',
  },
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Traditional single-column with serif fonts. Conservative and ATS-safe.',
    color: '#374151',
    icon: '📰',
    preview: 'Single-column • Serif • Black & White',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Ultra-clean design with maximum whitespace. Modern and distraction-free.',
    color: '#6b7280',
    icon: '⬜',
    preview: 'Single-column • Helvetica • Minimal',
  },
];

export default function SkillsStep({
  skills,
  summary,
  template,
  onSkillsChange,
  onSummaryChange,
  onTemplateChange,
}: Props) {
  return (
    <div>
      <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
        🛠️ Skills &amp; Final Details
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '24px' }}>
        Almost there! Add your skills and pick a template style.
      </p>

      {/* Skills */}
      <div style={{ marginBottom: '20px' }}>
        <label
          style={{
            display: 'block',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Technical &amp; Soft Skills *
        </label>
        <textarea
          className="input-field"
          value={skills}
          onChange={(e) => onSkillsChange(e.target.value)}
          placeholder="React, Node.js, Python, TypeScript, AWS, Leadership, Communication, Problem Solving..."
          rows={3}
          style={{ resize: 'vertical' }}
        />
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '6px' }}>
          Comma-separated. AI will automatically categorize them into technical, soft, and language
          skills.
        </p>
      </div>

      {/* Additional context */}
      <div style={{ marginBottom: '28px' }}>
        <label
          style={{
            display: 'block',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Additional Context for AI (optional)
        </label>
        <textarea
          className="input-field"
          value={summary}
          onChange={(e) => onSummaryChange(e.target.value)}
          placeholder="Mention your career goals, target role, industry, or any specific achievements you'd like highlighted..."
          rows={3}
          style={{ resize: 'vertical' }}
        />
      </div>

      {/* Template selection */}
      <div>
        <label
          style={{
            display: 'block',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '12px',
            fontWeight: '500',
            marginBottom: '16px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Choose a Template
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {TEMPLATES.map((t) => (
            <div
              key={t.id}
              onClick={() => onTemplateChange(t.id)}
              style={{
                border: `2px solid ${template === t.id ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '12px',
                padding: '16px',
                cursor: 'pointer',
                background:
                  template === t.id ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
                transition: 'all 0.2s',
                position: 'relative',
              }}
            >
              {template === t.id && (
                <div
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: '#6366f1',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    color: 'white',
                    fontWeight: '700',
                  }}
                >
                  ✓
                </div>
              )}
              <div
                style={{
                  width: '100%',
                  height: '60px',
                  borderRadius: '8px',
                  background: t.color,
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  opacity: 0.85,
                }}
              >
                {t.icon}
              </div>
              <div
                style={{
                  color: template === t.id ? '#a5b4fc' : 'white',
                  fontWeight: '600',
                  fontSize: '14px',
                  marginBottom: '4px',
                }}
              >
                {t.name}
              </div>
              <div
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '11px',
                  lineHeight: '1.5',
                  marginBottom: '8px',
                }}
              >
                {t.desc}
              </div>
              <div
                style={{
                  color: template === t.id ? '#6366f1' : 'rgba(255,255,255,0.2)',
                  fontSize: '10px',
                  fontFamily: 'monospace',
                }}
              >
                {t.preview}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
