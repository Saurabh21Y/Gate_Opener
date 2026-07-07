'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ResumeListItem } from '@/lib/types';
import api from '@/lib/api';

const TEMPLATE_COLORS: Record<string, string> = {
  modern: '#6366f1',
  classic: '#374151',
  minimal: '#6b7280',
};

const TEMPLATE_ICONS: Record<string, string> = {
  modern: '🎨',
  classic: '📰',
  minimal: '⬜',
};

export default function ResumesPage() {
  const router = useRouter();
  const [resumes, setResumes] = useState<ResumeListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/resumes')
      .then(({ data }) => setResumes(data))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this resume?')) return;
    await api.delete(`/api/resumes/${id}`);
    setResumes((r) => r.filter((x) => x.id !== id));
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '48px 24px 80px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '36px',
          }}
        >
          <div>
            <h1
              style={{ color: 'white', fontSize: '28px', fontWeight: '700', marginBottom: '6px' }}
            >
              Your Resumes
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
              {resumes.length} resume{resumes.length !== 1 ? 's' : ''} generated
            </p>
          </div>
          <Link href="/">
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              ➕ New Resume
            </button>
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <div className="spinner" />
            Loading resumes…
          </div>
        )}

        {/* Empty state */}
        {!loading && resumes.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 24px',
              border: '2px dashed rgba(255,255,255,0.08)',
              borderRadius: '16px',
            }}
          >
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>📄</div>
            <h2
              style={{ color: 'white', fontSize: '20px', fontWeight: '600', marginBottom: '8px' }}
            >
              No resumes yet
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>
              Create your first AI-powered resume in minutes.
            </p>
            <Link href="/">
              <button className="btn-primary">✨ Create Resume</button>
            </Link>
          </div>
        )}

        {/* Resume grid */}
        {!loading && resumes.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}
          >
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="glass-card"
                onClick={() => router.push(`/editor/${resume.id}`)}
                style={{
                  padding: '0',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s, transform 0.2s',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.4)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Color banner */}
                <div
                  style={{
                    height: '6px',
                    background: TEMPLATE_COLORS[resume.template] || '#6366f1',
                  }}
                />

                <div style={{ padding: '20px' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '10px',
                        background: `${TEMPLATE_COLORS[resume.template]}22`,
                        border: `1px solid ${TEMPLATE_COLORS[resume.template]}44`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                      }}
                    >
                      {TEMPLATE_ICONS[resume.template] || '📄'}
                    </div>
                    <button
                      onClick={(e) => handleDelete(resume.id, e)}
                      style={{
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.15)',
                        color: '#f87171',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '11px',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s',
                      }}
                    >
                      Delete
                    </button>
                  </div>

                  <h3
                    style={{
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: '600',
                      marginBottom: '6px',
                      lineHeight: '1.3',
                    }}
                  >
                    {resume.title}
                  </h3>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                    }}
                  >
                    <span
                      style={{
                        background: `${TEMPLATE_COLORS[resume.template]}22`,
                        color: TEMPLATE_COLORS[resume.template],
                        border: `1px solid ${TEMPLATE_COLORS[resume.template]}44`,
                        padding: '2px 8px',
                        borderRadius: '100px',
                        fontSize: '10px',
                        fontWeight: '600',
                        textTransform: 'capitalize',
                      }}
                    >
                      {resume.template}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px' }}>
                      {new Date(resume.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <div
                    style={{
                      color: '#a5b4fc',
                      fontSize: '12px',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    Open Editor →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
