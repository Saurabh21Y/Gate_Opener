import BookingForm from '@/components/BookingForm';

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh' }}>
      {/* ── Hero Section ── */}
      <section
        className="animated-gradient"
        style={{ padding: '80px 24px 60px', textAlign: 'center' }}
      >
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          {/* Live badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(99,102,241,0.15)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '100px',
              padding: '6px 16px',
              marginBottom: '24px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#6366f1',
                display: 'inline-block',
                animation: 'pulse 2s infinite',
              }}
            />
            <span style={{ color: '#a5b4fc', fontSize: '13px', fontWeight: '500' }}>
              Now accepting new clients
            </span>
          </div>

          {/* Heading */}
          <h1
            className="gradient-text"
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: '800',
              lineHeight: '1.15',
              marginBottom: '20px',
              letterSpacing: '-0.03em',
            }}
          >
            Book Your Expert
            <br />
            Consulting Session
          </h1>

          {/* Subtitle */}
          <p
            style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '18px',
              lineHeight: '1.7',
              marginBottom: '32px',
            }}
          >
            Work 1-on-1 with our expert team. Get actionable insights tailored to your
            business. Secure payments via Stripe.
          </p>

          {/* Feature pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
            }}
          >
            {[
              '✓ Instant Email Confirmation',
              '✓ Google Calendar Invite',
              '✓ Secure Stripe Payment',
            ].map((feat) => (
              <span
                key={feat}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '100px',
                  padding: '8px 18px',
                  color: 'rgba(255,255,255,0.75)',
                  fontSize: '14px',
                }}
              >
                {feat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Booking Form Section ── */}
      <section style={{ padding: '0 24px 80px', marginTop: '-32px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <BookingForm />
        </div>
      </section>
    </main>
  );
}
