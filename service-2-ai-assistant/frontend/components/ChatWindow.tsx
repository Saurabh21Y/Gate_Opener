'use client';
import { useState, useEffect, useRef } from 'react';
import { Message, Session } from '@/lib/types';
import api from '@/lib/api';
import { useStream } from '@/hooks/useStream';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  session: Session | null;
  onSessionUpdate: (sessionId: string, newTitle: string) => void;
}

function renderMarkdown(text: string): string {
  return text
    .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(
      /^### (.+)$/gm,
      '<h3 style="color:#a5b4fc;margin:12px 0 6px">$1</h3>'
    )
    .replace(
      /^## (.+)$/gm,
      '<h2 style="color:#c4b5fd;margin:16px 0 8px">$1</h2>'
    )
    .replace(/^- (.+)$/gm, '<li style="margin:4px 0">$1</li>')
    .replace(
      /(<li[^>]*>.*<\/li>)/gs,
      '<ul style="padding-left:20px;margin:8px 0">$1</ul>'
    )
    .replace(/\n\n/g, '</p><p style="margin:10px 0">')
    .replace(/\n/g, '<br />');
}

export default function ChatWindow({ session, onSessionUpdate }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isStreaming, streamingContent, sendMessage, stopStream } = useStream();

  useEffect(() => {
    if (!session) {
      setMessages([]);
      return;
    }
    loadMessages(session.id);
  }, [session?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  const loadMessages = async (sessionId: string) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/sessions/${sessionId}/messages`);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (content: string) => {
    if (!session || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sessionId: session.id,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);

    await sendMessage(session.id, content, fullContent => {
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sessionId: session.id,
        role: 'assistant',
        content: fullContent,
        createdAt: new Date().toISOString(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    });
  };

  if (!session) {
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#333',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🤖</div>
        <h2 style={{ color: '#555', fontWeight: '600', marginBottom: '8px' }}>
          AI Assistant
        </h2>
        <p style={{ color: '#333', fontSize: '14px' }}>
          Select a chat or create a new one to get started.
        </p>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: '#444', padding: '40px' }}>
              Loading messages...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>✨</div>
              <h3 style={{ color: '#555', fontWeight: '600', marginBottom: '8px' }}>
                Start the conversation
              </h3>
              <p style={{ color: '#333', fontSize: '14px' }}>
                Ask me anything — I&apos;m powered by GPT-4o.
              </p>
            </div>
          ) : (
            messages.map(msg => (
              <div
                key={msg.id}
                className="message-appear"
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '16px',
                }}
              >
                {msg.role === 'assistant' && (
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '10px',
                      flexShrink: 0,
                      fontSize: '14px',
                    }}
                  >
                    🤖
                  </div>
                )}
                <div
                  style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius:
                      msg.role === 'user'
                        ? '18px 18px 4px 18px'
                        : '18px 18px 18px 4px',
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : '#1c1c1c',
                    border:
                      msg.role === 'assistant' ? '1px solid #2a2a2a' : 'none',
                    color: '#e2e8f0',
                    fontSize: '14px',
                    lineHeight: '1.7',
                  }}
                >
                  {msg.role === 'assistant' ? (
                    <div
                      className="prose-dark"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(msg.content),
                      }}
                    />
                  ) : (
                    <span>{msg.content}</span>
                  )}
                </div>
              </div>
            ))
          )}

          {/* Streaming message */}
          {isStreaming && (
            <div
              className="message-appear"
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '10px',
                  flexShrink: 0,
                  fontSize: '14px',
                }}
              >
                🤖
              </div>
              <div
                style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '18px 18px 18px 4px',
                  background: '#1c1c1c',
                  border: '1px solid #2a2a2a',
                  color: '#e2e8f0',
                  fontSize: '14px',
                  lineHeight: '1.7',
                }}
              >
                {streamingContent ? (
                  <>
                    <div
                      className="prose-dark"
                      dangerouslySetInnerHTML={{
                        __html: renderMarkdown(streamingContent),
                      }}
                    />
                    <span className="cursor-blink" />
                  </>
                ) : (
                  <span style={{ color: '#444' }}>
                    Thinking<span className="cursor-blink" />
                  </span>
                )}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <MessageInput
        onSend={handleSend}
        isStreaming={isStreaming}
        onStop={stopStream}
        disabled={loading}
      />
    </div>
  );
}
