'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import { Resume, Template } from '@/lib/types';
import api from '@/lib/api';

// Tiptap must be dynamic (no SSR) due to browser-only APIs
const TiptapEditor = dynamic(() => import('@/components/TiptapEditor'), { ssr: false });

const TEMPLATES: Array<{ id: Template; label: string; icon: string }> = [
  { id: 'modern', label: 'Modern', icon: '🎨' },
  { id: 'classic', label: 'Classic', icon: '📰' },
  { id: 'minimal', label: 'Minimal', icon: '⬜' },
];

type EditorMode = 'preview' | 'edit';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [resume, setResume] = useState<Resume | null>(null);
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [mode, setMode] = useState<EditorMode>('preview');

  // ── Load resume ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    api
      .get(`/api/resumes/${id}`)
      .then(({ data }) => {
        setResume(data);
        setHtmlContent(data.htmlContent || '');
      })
      .catch(() => setError('Failed to load resume.'))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/api/resumes/${id}`, { htmlContent });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Save failed.');
    } finally {
      setSaving(false);
    }
  };

  // ── Template switch ──────────────────────────────────────────────────────────
  const handleTemplateChange = async (template: Template) => {
    if (!resume || template === resume.template) return;
    setSwitching(true);
    try {
      const { data } = await api.post(`/api/resumes/${id}/change-template`, { template });
      setHtmlContent(data.htmlContent);
      setResume((r) => (r ? { ...r, template } : r));
    } catch {
      setError('Template switch failed.');
    } finally {
      setSwitching(false);
    }
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!confirm('Delete this resume permanently?')) return;
    await api.delete(`/api/resumes/${id}`);
    router.push('/resumes');
  };

  // ── Loading / Error ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px' }} />
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>Loading resume…</p>
      </div>
    );
  }

  if (error && !resume) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '48px' }}>⚠️</div>
        <p style={{ color: '#f87171', fontSize: '16px' }}>{error}</p>
        <button className="btn-secondary" onClick={() => router.push('/')}>
          ← Back to Home
        </button>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar
        title={resume?.title || 'Editor'}
        showSave
        onSave={handleSave}
        saving={saving}
      />

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '24px 24px 60px',
          display: 'grid',
          gridTemplateColumns: '280px 1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* ── Sidebar ── */}
        <aside>
          {/* Mode toggle */}
          <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
            <p
              style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}
            >
              View Mode
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '6px',
              }}
            >
              {(['preview', 'edit'] as EditorMode[]).map((m) => (
                <button
                  key={m}
                  id={`mode-${m}`}
                  onClick={() => setMode(m)}
                  style={{
                    background:
                      mode === m ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.04)',
                    border:
                      mode === m ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    color: mode === m ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                    borderRadius: '8px',
                    padding: '8px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                    textTransform: 'capitalize',
                  }}
                >
                  {m === 'preview' ? '👁️ Preview' : '✏️ Edit'}
                </button>
              ))}
            </div>
          </div>

          {/* Template switcher */}
          <div className="glass-card" style={{ padding: '20px', marginBottom: '16px' }}>
            <p
              style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}
            >
              Template
            </p>
            {switching && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '8px',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span className="spinner" style={{ width: '14px', height: '14px' }} />
                Switching…
              </div>
            )}
            {!switching && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    id={`template-${t.id}`}
                    onClick={() => handleTemplateChange(t.id)}
                    style={{
                      background:
                        resume?.template === t.id
                          ? 'rgba(99,102,241,0.15)'
                          : 'rgba(255,255,255,0.04)',
                      border:
                        resume?.template === t.id
                          ? '1px solid rgba(99,102,241,0.35)'
                          : '1px solid rgba(255,255,255,0.08)',
                      color:
                        resume?.template === t.id ? '#a5b4fc' : 'rgba(255,255,255,0.6)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: resume?.template === t.id ? '600' : '400',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    {t.icon} {t.label}
                    {resume?.template === t.id && (
                      <span
                        style={{
                          marginLeft: 'auto',
                          background: '#6366f1',
                          borderRadius: '50%',
                          width: '16px',
                          height: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '9px',
                          color: 'white',
                          fontWeight: '700',
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <p
              style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px',
              }}
            >
              Actions
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                id="action-save"
                className="btn-primary"
                onClick={handleSave}
                disabled={saving}
                style={{ width: '100%', textAlign: 'center' }}
              >
                {saved ? '✅ Saved!' : saving ? 'Saving…' : '💾 Save Changes'}
              </button>
              <button
                id="action-new"
                className="btn-secondary"
                onClick={() => router.push('/')}
                style={{ width: '100%', textAlign: 'center', fontSize: '13px' }}
              >
                ➕ New Resume
              </button>
              <button
                id="action-list"
                className="btn-secondary"
                onClick={() => router.push('/resumes')}
                style={{ width: '100%', textAlign: 'center', fontSize: '13px' }}
              >
                📋 All Resumes
              </button>
              <button
                id="action-delete"
                onClick={handleDelete}
                style={{
                  width: '100%',
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171',
                  borderRadius: '8px',
                  padding: '10px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginTop: '12px',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: '#f87171',
                fontSize: '12px',
              }}
            >
              {error}
            </div>
          )}
        </aside>

        {/* ── Main content ── */}
        <main>
          {mode === 'preview' ? (
            <div className="glass-card fade-in" style={{ overflow: 'hidden' }}>
              <div
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '12px',
                }}
              >
                <span>👁️</span> Preview Mode — Click &quot;Edit&quot; to make changes
              </div>
              <iframe
                srcDoc={htmlContent}
                style={{
                  width: '100%',
                  height: '900px',
                  border: 'none',
                  background: 'white',
                  display: 'block',
                }}
                title="Resume Preview"
              />
            </div>
          ) : (
            <div className="glass-card fade-in" style={{ padding: '0', overflow: 'hidden' }}>
              <div
                style={{
                  padding: '12px 20px',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '12px',
                }}
              >
                <span>✏️</span> Edit Mode — Changes are saved when you click &quot;Save&quot;
              </div>
              <div style={{ padding: '16px' }}>
                <TiptapEditor content={htmlContent} onChange={setHtmlContent} />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
