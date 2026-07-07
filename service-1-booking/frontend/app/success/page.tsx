import Link from 'next/link';

export const metadata = {
  title: 'Booking Confirmed — Venture Builders',
  description: 'Your consulting session has been booked successfully.',
};

export default function SuccessPage() {
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
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>

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
          Payment Successful!
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
          Your consulting session has been booked. Check your email for the
          confirmation and Google Calendar invite.
        </p>

        {/* Info box */}
        <div
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '32px',
          }}
        >
          <p style={{ color: '#a5b4fc', fontSize: '14px', margin: 0 }}>
            📧 A confirmation email has been sent to your inbox with all booking
            details.
          </p>
        </div>

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
          Book Another Session
        </Link>
      </div>
    </main>
  );
}
