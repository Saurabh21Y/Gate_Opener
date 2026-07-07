'use client';
import { useState, useRef, KeyboardEvent } from 'react';

interface MessageInputProps {
  onSend: (content: string) => void;
  isStreaming: boolean;
  onStop: () => void;
  disabled: boolean;
}

export default function MessageInput({ onSend, isStreaming, onStop, disabled }: MessageInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 160) + 'px';
    }
  };

  return (
    <div style={{ padding: '16px 24px', background: '#0D0D0D', borderTop: '1px solid #1a1a1a' }}>
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
          background: '#1a1a1a',
          borderRadius: '16px',
          border: '1px solid #2a2a2a',
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          padding: '12px 16px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          placeholder="Message AI Assistant... (Enter to send, Shift+Enter for newline)"
          disabled={isStreaming || disabled}
          rows={1}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e2e8f0',
            fontSize: '15px',
            resize: 'none',
            fontFamily: 'inherit',
            lineHeight: '1.6',
            maxHeight: '160px',
            overflowY: 'auto',
            minHeight: '24px',
          }}
        />
        {isStreaming ? (
          <button
            onClick={onStop}
            style={{
              padding: '8px 14px',
              background: 'rgba(239,68,68,0.15)',
              border: '1px solid rgba(239,68,68,0.3)',
              color: '#f87171',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            ⬛ Stop
          </button>
        ) : (
          <button
            onClick={handleSend}
            disabled={!input.trim() || disabled}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: input.trim()
                ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                : '#2a2a2a',
              border: 'none',
              color: input.trim() ? 'white' : '#444',
              cursor: input.trim() ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            ↑
          </button>
        )}
      </div>
      <div
        style={{
          textAlign: 'center',
          color: '#333',
          fontSize: '11px',
          marginTop: '8px',
        }}
      >
        Powered by GPT-4o
      </div>
    </div>
  );
}
