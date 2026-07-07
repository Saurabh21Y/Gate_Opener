'use client';

interface NavbarProps {
  title?: string;
  showSave?: boolean;
  onSave?: () => void;
  saving?: boolean;
}

export default function Navbar({ title, showSave, onSave, saving }: NavbarProps) {
  return (
    <nav
      style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            flexShrink: 0,
          }}
        >
          📄
        </div>
        <span style={{ color: 'white', fontWeight: '700', fontSize: '16px' }}>Resume Builder</span>
        {title && (
          <>
            <span style={{ color: 'rgba(255,255,255,0.2)', margin: '0 4px' }}>/</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{title}</span>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a
          href="/"
          style={{
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            fontSize: '13px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'white')}
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)')
          }
        >
          ← Home
        </a>
        {showSave && (
          <button
            className="btn-primary"
            onClick={onSave}
            disabled={saving}
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            {saving ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="spinner" style={{ width: '14px', height: '14px' }} />
                Saving…
              </span>
            ) : (
              '💾 Save'
            )}
          </button>
        )}
      </div>
    </nav>
  );
}
