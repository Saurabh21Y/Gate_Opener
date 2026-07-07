import Link from 'next/link';

export const metadata = {
  title: 'Payment Cancelled — Venture Builders',
  description: 'Your booking was not completed. No charge was made.',
};

export default function CancelPage() {
  return (
    <main
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        className="glass-card"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '56px 48px',
          textAlign: 'center',
        }}
      >
        {/* Icon */}
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>😔</div>

        {/* Heading */}
        <h1
          style={{
            color: 'white',
            fontSize: '32px',
            fontWeight: '800',
            marginBottom: '16px',
            letterSpacing: '-0.02em',
          }}
        >
          Payment Cancelled
        </h1>

        {/* Body */}
        <p
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontSize: '16px',
            lineHeight: '1.7',
            marginBottom: '32px',
          }}
        >
          No worries — your booking was not completed and no charge was made. You
          can go back and try again whenever you&apos;re ready.
        </p>

        {/* CTA */}
        <Link
          href="/"
          style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
            color: 'white',
            padding: '14px 32px',
            borderRadius: '10px',
            textDecoration: 'none',
            fontWeight: '600',
            fontSize: '15px',
          }}
        >
          Try Again
        </Link>
      </div>
    </main>
  );
}
