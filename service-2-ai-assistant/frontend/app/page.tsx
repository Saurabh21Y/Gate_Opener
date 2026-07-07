'use client';
import { useState, useEffect } from 'react';
import { Session } from '@/lib/types';
import api from '@/lib/api';
import ChatSidebar from '@/components/ChatSidebar';
import ChatWindow from '@/components/ChatWindow';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data } = await api.get('/api/sessions');
      setSessions(data);
    } catch (err) {
      console.error('Failed to load sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewSession = async () => {
    try {
      const { data } = await api.post('/api/sessions', { title: 'New Chat' });
      setSessions(prev => [data, ...prev]);
      setActiveSession(data);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const handleSelectSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) setActiveSession(session);
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await api.delete(`/api/sessions/${id}`);
      setSessions(prev => prev.filter(s => s.id !== id));
      if (activeSession?.id === id) setActiveSession(null);
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const handleSessionUpdate = (sessionId: string, newTitle: string) => {
    setSessions(prev =>
      prev.map(s => (s.id === sessionId ? { ...s, title: newTitle } : s))
    );
    if (activeSession?.id === sessionId) {
      setActiveSession(prev => (prev ? { ...prev, title: newTitle } : null));
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#0D0D0D',
      }}
    >
      <Navbar sessionTitle={activeSession?.title} />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <ChatSidebar
          sessions={sessions}
          activeSessionId={activeSession?.id || null}
          onSelectSession={handleSelectSession}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          loading={loading}
        />
        <ChatWindow session={activeSession} onSessionUpdate={handleSessionUpdate} />
      </div>
    </div>
  );
}
