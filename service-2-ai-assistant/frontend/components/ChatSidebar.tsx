'use client';
import { useState } from 'react';
import { Session } from '@/lib/types';

interface ChatSidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  loading: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function ChatSidebar({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  loading,
}: ChatSidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      style={{
        width: '260px',
        background: '#111111',
        borderRight: '1px solid #1a1a1a',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid #1a1a1a' }}>
        <button
          onClick={onNewSession}
          style={{
            width: '100%',
            padding: '10px 16px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'opacity 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <span style={{ fontSize: '16px' }}>+</span> New Chat
        </button>
      </div>

      {/* Sessions List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {loading ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: '#555',
              fontSize: '13px',
            }}
          >
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: '#555',
              fontSize: '13px',
            }}
          >
            No chats yet.
            <br />
            Start a new conversation!
          </div>
        ) : (
          sessions.map(session => (
            <div
              key={session.id}
              onMouseEnter={() => setHoveredId(session.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onSelectSession(session.id)}
              style={{
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '2px',
                background:
                  activeSessionId === session.id
                    ? 'rgba(99,102,241,0.15)'
                    : hoveredId === session.id
                    ? 'rgba(255,255,255,0.04)'
                    : 'transparent',
                border:
                  activeSessionId === session.id
                    ? '1px solid rgba(99,102,241,0.3)'
                    : '1px solid transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: activeSessionId === session.id ? '#a5b4fc' : '#d1d5db',
                    fontSize: '13px',
                    fontWeight: '500',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  💬 {session.title}
                </div>
                <div style={{ color: '#444', fontSize: '11px', marginTop: '2px' }}>
                  {timeAgo(session.updatedAt)}
                </div>
              </div>
              {hoveredId === session.id && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    if (confirm('Delete this chat?')) onDeleteSession(session.id);
                  }}
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171',
                    padding: '3px 7px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    marginLeft: '8px',
                    flexShrink: 0,
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid #1a1a1a',
          color: '#333',
          fontSize: '11px',
          textAlign: 'center',
        }}
      >
        Venture Builders AI Assistant
      </div>
    </div>
  );
}
