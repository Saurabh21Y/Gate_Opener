import { Education } from '@/lib/types';

interface Props {
  data: Education[];
  onChange: (data: Education[]) => void;
}

const emptyEdu = (): Education => ({
  id: Date.now().toString(),
  institution: '',
  degree: '',
  field: '',
  startDate: '',
  endDate: '',
  gpa: '',
});

const fieldDefs: Array<[keyof Education, string, string]> = [
  ['institution', 'Institution / University *', 'e.g. MIT'],
  ['degree', 'Degree Type *', 'e.g. Bachelor of Science'],
  ['field', 'Field of Study *', 'e.g. Computer Science'],
  ['startDate', 'Start Year', 'e.g. 2018'],
  ['endDate', 'End Year', 'e.g. 2022'],
  ['gpa', 'GPA (optional)', 'e.g. 3.8'],
];

export default function EducationStep({ data, onChange }: Props) {
  const add = () => onChange([...data, emptyEdu()]);
  const remove = (id: string) => onChange(data.filter((e) => e.id !== id));
  const update = (id: string, field: keyof Education, value: string) =>
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
        <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>🎓 Education</h3>
        <button
          className="btn-secondary"
          onClick={add}
          style={{ padding: '8px 16px', fontSize: '13px' }}
        >
          + Add Education
        </button>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '20px' }}>
        Add your academic qualifications.
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
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎓</div>
          <p style={{ fontSize: '14px' }}>No education added yet.</p>
          <p style={{ fontSize: '12px', marginTop: '4px' }}>
            Click &quot;+ Add Education&quot; to get started.
          </p>
        </div>
      ) : (
        data.map((edu, i) => (
          <div
            key={edu.id}
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
                Education #{i + 1}
              </span>
              <button
                onClick={() => remove(edu.id)}
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
                    value={edu[key] as string}
                    onChange={(e) => update(edu.id, key, e.target.value)}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
