export default function Navbar() {
  return (
    <nav
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(15,15,35,0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <span style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>VB</span>
        </div>
        <span
          style={{
            color: 'white',
            fontWeight: '700',
            fontSize: '18px',
            letterSpacing: '-0.02em',
          }}
        >
          Venture Builders
        </span>
      </div>

      {/* Label */}
      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>
        Consulting Services
      </span>
    </nav>
  );
}
