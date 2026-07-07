import { Experience } from '@/lib/types';

interface Props {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

const emptyExp = (): Experience => ({
  id: Date.now().toString(),
  company: '',
  position: '',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
});

const fieldDefs: Array<[keyof Experience, string, string?]> = [
  ['company', 'Company *', 'e.g. Google'],
  ['position', 'Position *', 'e.g. Software Engineer'],
  ['startDate', 'Start Date *', 'e.g. Jan 2022'],
  ['endDate', 'End Date', 'e.g. Present'],
];

export default function ExperienceStep({ data, onChange }: Props) {
  const add = () => onChange([...data, emptyExp()]);
  const remove = (id: string) => onChange(data.filter((e) => e.id !== id));
  const update = (id: string, field: keyof Experience, value: string | boolean) =>
    onChange(data.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px',
        }}
      >
        <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>💼 Work Experience</h3>
        <button
          className="btn-secondary"
          onClick={add}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          + Add Experience
        </button>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>
        Add your work history. AI will expand your descriptions into polished bullet points.
      </p>

      {data.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '48px 24px',
            color: 'rgba(255,255,255,0.3)',
            border: '2px dashed rgba(255,255,255,0.1)',
            borderRadius: '12px',
          }}
        >
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>💼</div>
          <p style={{ fontSize: '14px' }}>No experience added yet.</p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            Click &quot;+ Add Experience&quot; to get started.
          </p>
        </div>
      ) : (
        data.map((exp, i) => (
          <div
            key={exp.id}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <span style={{ color: '#a5b4fc', fontWeight: '600', fontSize: '13px' }}>
                Experience #{i + 1}
              </span>
              <button
                onClick={() => remove(exp.id)}
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontFamily: 'inherit',
                }}
              >
                Remove
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              {fieldDefs.map(([key, label, placeholder]) => (
                <div key={String(key)}>
                  <label
                    style={{
                      display: 'block',
                      color: 'rgba(255,255,255,0.5)',
                      fontSize: '11px',
                      marginBottom: '5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {label}
                  </label>
                  <input
                    className="input-field"
                    value={String(exp[key])}
                    onChange={(e) => update(exp.id, key, e.target.value)}
                    placeholder={placeholder}
                    disabled={key === 'endDate' && exp.current}
                  />
                </div>
              ))}

              {/* Currently working here checkbox */}
              <div
                style={{
                  gridColumn: 'span 2',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => {
                    update(exp.id, 'current', e.target.checked);
                    if (e.target.checked) update(exp.id, 'endDate', 'Present');
                  }}
                  style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                />
                <label
                  htmlFor={`current-${exp.id}`}
                  style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', cursor: 'pointer' }}
                >
                  Currently working here
                </label>
              </div>

              {/* Description */}
              <div style={{ gridColumn: 'span 2' }}>
                <label
                  style={{
                    display: 'block',
                    color: 'rgba(255,255,255,0.5)',
                    fontSize: '11px',
                    marginBottom: '5px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Key Responsibilities & Achievements
                </label>
                <textarea
                  className="input-field"
                  value={exp.description}
                  onChange={(e) => update(exp.id, 'description', e.target.value)}
                  placeholder="Describe your role, responsibilities, and achievements. AI will enhance and quantify these..."
                  rows={3}
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
