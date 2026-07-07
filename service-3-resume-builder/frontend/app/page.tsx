import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ResumeForm from '@/components/ResumeForm';

export const metadata: Metadata = {
  title: 'Create Resume — AI Resume Builder',
  description: 'Fill in your details and let GPT-4o craft an ATS-optimized resume for you.',
};

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f' }}>
      <Navbar />

      {/* Hero Section */}
      <div
        style={{
          textAlign: 'center',
          padding: '60px 24px 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '100px',
            padding: '6px 16px',
            marginBottom: '20px',
            fontSize: '12px',
            color: '#a5b4fc',
            fontWeight: '500',
          }}
        >
          <span>✨</span>
          Powered by GPT-4o · Service 3 of 3
        </div>

        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 52px)',
            fontWeight: '800',
            lineHeight: '1.15',
            marginBottom: '16px',
            color: 'white',
          }}
        >
          Build Your Resume
          <br />
          <span className="gradient-text">with AI Precision</span>
        </h1>

        <p
          style={{
            color: 'rgba(255,255,255,0.5)',
            fontSize: '16px',
            maxWidth: '520px',
            margin: '0 auto 40px',
            lineHeight: '1.7',
          }}
        >
          Fill in your details across 4 simple steps. GPT-4o crafts ATS-optimized bullet points,
          professional summaries, and skills — ready to edit and download.
        </p>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '48px',
          }}
        >
          {[
            '🤖 GPT-4o Generated',
            '📋 ATS Optimized',
            '✏️ Tiptap Editor',
            '🎨 3 Templates',
            '⚡ Instant Preview',
          ].map((pill) => (
            <span
              key={pill}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '100px',
                padding: '6px 14px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.6)',
              }}
            >
              {pill}
            </span>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 24px 80px' }}>
        <ResumeForm />

        {/* Past resumes link */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <Link
            href="/resumes"
            style={{
              color: 'rgba(255,255,255,0.35)',
              fontSize: '13px',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
          >
            View past resumes →
          </Link>
        </div>
      </div>
    </div>
  );
}
