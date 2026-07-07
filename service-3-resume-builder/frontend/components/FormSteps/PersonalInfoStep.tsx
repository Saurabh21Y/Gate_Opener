import { PersonalInfo } from '@/lib/types';

interface Props {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

const fields: Array<{
  key: keyof PersonalInfo;
  label: string;
  placeholder: string;
  required: boolean;
  type?: string;
  fullWidth?: boolean;
}> = [
  { key: 'name', label: 'Full Name *', placeholder: 'John Doe', required: true, fullWidth: true },
  { key: 'email', label: 'Email Address *', placeholder: 'john@example.com', required: true, type: 'email' },
  { key: 'phone', label: 'Phone Number *', placeholder: '+1 (555) 000-0000', required: true, type: 'tel' },
  { key: 'location', label: 'Location *', placeholder: 'New York, NY', required: true },
  { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'linkedin.com/in/johndoe', required: false },
  { key: 'portfolio', label: 'Portfolio / Website', placeholder: 'johndoe.com', required: false },
];

export default function PersonalInfoStep({ data, onChange }: Props) {
  return (
    <div>
      <h3 style={{ color: 'white', fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
        👤 Personal Information
      </h3>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '24px' }}>
        Basic contact details that will appear on your resume.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {fields.map((f) => (
          <div key={f.key} style={{ gridColumn: f.fullWidth ? 'span 2' : 'span 1' }}>
            <label
              style={{
                display: 'block',
                color: 'rgba(255,255,255,0.6)',
                fontSize: '12px',
                fontWeight: '500',
                marginBottom: '6px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {f.label}
            </label>
            <input
              className="input-field"
              type={f.type || 'text'}
              value={data[f.key]}
              onChange={(e) => onChange({ ...data, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              required={f.required}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
