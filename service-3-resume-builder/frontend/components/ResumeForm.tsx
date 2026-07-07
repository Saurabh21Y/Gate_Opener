'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResumeFormData, Template, Step } from '@/lib/types';
import PersonalInfoStep from './FormSteps/PersonalInfoStep';
import ExperienceStep from './FormSteps/ExperienceStep';
import EducationStep from './FormSteps/EducationStep';
import SkillsStep from './FormSteps/SkillsStep';
import api from '@/lib/api';

const STEPS = [
  { num: 1 as Step, label: 'Personal Info', icon: '👤' },
  { num: 2 as Step, label: 'Experience', icon: '💼' },
  { num: 3 as Step, label: 'Education', icon: '🎓' },
  { num: 4 as Step, label: 'Skills & Template', icon: '🛠️' },
];

const initialFormData: ResumeFormData = {
  personalInfo: { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
  experience: [],
  education: [],
  skills: '',
  summary: '',
};

export default function ResumeForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('modern');
  const [formData, setFormData] = useState<ResumeFormData>(initialFormData);

  // ── Validation ──────────────────────────────────────────────────────────────
  const canAdvance = (): boolean => {
    if (step === 1) {
      const { name, email, phone, location } = formData.personalInfo;
      return !!(name && email && phone && location);
    }
    if (step === 4) return !!formData.skills.trim();
    return true; // steps 2 & 3 are optional
  };

  const handleNext = () => {
    if (step < 4) setStep(((step + 1) as Step));
  };

  const handleBack = () => {
    if (step > 1) setStep(((step - 1) as Step));
  };

  // ── Generate ────────────────────────────────────────────────────────────────
  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/api/resumes/generate', {
        formData,
        template: selectedTemplate,
      });
      router.push(`/editor/${data.id}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
            'Failed to generate resume. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Progress Steps */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
        {STEPS.map((s, i) => (
          <div
            key={s.num}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: i < STEPS.length - 1 ? 1 : 'none',
            }}
          >
            <div
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background:
                    step > s.num
                      ? '#6366f1'
                      : step === s.num
                      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                      : 'rgba(255,255,255,0.06)',
                  border:
                    step === s.num
                      ? 'none'
                      : step > s.num
                      ? '2px solid #6366f1'
                      : '2px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: step > s.num ? '14px' : '18px',
                  color: step >= s.num ? 'white' : 'rgba(255,255,255,0.25)',
                  fontWeight: '700',
                  transition: 'all 0.3s',
                  cursor: step > s.num ? 'pointer' : 'default',
                }}
                onClick={() => step > s.num && setStep(s.num)}
                title={step > s.num ? `Back to ${s.label}` : undefined}
              >
                {step > s.num ? '✓' : s.icon}
              </div>
              <span
                style={{
                  fontSize: '11px',
                  color: step >= s.num ? '#a5b4fc' : 'rgba(255,255,255,0.25)',
                  fontWeight: step === s.num ? '600' : '400',
                  whiteSpace: 'nowrap',
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  background: step > s.num ? '#6366f1' : 'rgba(255,255,255,0.08)',
                  margin: '0 8px',
                  marginBottom: '20px',
                  transition: 'background 0.3s',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="glass-card" style={{ padding: '32px', marginBottom: '24px' }}>
        <div className="step-enter">
          {step === 1 && (
            <PersonalInfoStep
              data={formData.personalInfo}
              onChange={(p) => setFormData((f) => ({ ...f, personalInfo: p }))}
            />
          )}
          {step === 2 && (
            <ExperienceStep
              data={formData.experience}
              onChange={(e) => setFormData((f) => ({ ...f, experience: e }))}
            />
          )}
          {step === 3 && (
            <EducationStep
              data={formData.education}
              onChange={(e) => setFormData((f) => ({ ...f, education: e }))}
            />
          )}
          {step === 4 && (
            <SkillsStep
              skills={formData.skills}
              summary={formData.summary}
              template={selectedTemplate}
              onSkillsChange={(v) => setFormData((f) => ({ ...f, skills: v }))}
              onSummaryChange={(v) => setFormData((f) => ({ ...f, summary: v }))}
              onTemplateChange={setSelectedTemplate}
            />
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#f87171',
            fontSize: '14px',
            marginBottom: '16px',
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          className="btn-secondary"
          onClick={handleBack}
          disabled={step === 1}
          style={{ opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto' }}
        >
          ← Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {STEPS.map((s) => (
            <div
              key={s.num}
              style={{
                width: step === s.num ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                background: step >= s.num ? '#6366f1' : 'rgba(255,255,255,0.15)',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

        {step < 4 ? (
          <button
            className="btn-primary"
            onClick={handleNext}
            disabled={!canAdvance()}
          >
            Next →
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={handleGenerate}
            disabled={loading || !canAdvance()}
            style={{ minWidth: '160px' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
                <span className="spinner" />
                Generating…
              </span>
            ) : (
              '✨ Generate Resume'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
