'use client';

interface NavbarProps {
  sessionTitle?: string;
}

export default function Navbar({ sessionTitle }: NavbarProps) {
  return (
    <div
      style={{
        height: '56px',
        borderBottom: '1px solid #1a1a1a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        background: '#111111',
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '7px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '14px' }}>🤖</span>
        </div>
        <span style={{ fontWeight: '700', fontSize: '15px', color: 'white' }}>AI Assistant</span>
      </div>
      {sessionTitle && (
        <span
          style={{
            color: '#555',
            fontSize: '13px',
            maxWidth: '300px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {sessionTitle}
        </span>
      )}
    </div>
  );
}
