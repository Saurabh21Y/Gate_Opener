'use client';
import { useState, useRef } from 'react';

interface UseStreamReturn {
  isStreaming: boolean;
  streamingContent: string;
  sendMessage: (sessionId: string, content: string, onComplete: (fullContent: string) => void) => Promise<void>;
  stopStream: () => void;
}

export function useStream(): UseStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const abortRef = useRef<(() => void) | null>(null);

  const sendMessage = async (
    sessionId: string,
    content: string,
    onComplete: (fullContent: string) => void
  ) => {
    setIsStreaming(true);
    setStreamingContent('');
    let fullContent = '';
    let aborted = false;

    abortRef.current = () => {
      aborted = true;
      setIsStreaming(false);
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4002';
      const response = await fetch(`${apiUrl}/api/sessions/${sessionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (!aborted) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') {
            onComplete(fullContent);
            break;
          }
          try {
            const parsed = JSON.parse(data);
            if (parsed.token) {
              fullContent += parsed.token;
              setStreamingContent(prev => prev + parsed.token);
            }
          } catch {
            // Ignore malformed JSON chunks
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
      if (fullContent) onComplete(fullContent);
    } finally {
      setIsStreaming(false);
      setStreamingContent('');
    }
  };

  const stopStream = () => {
    if (abortRef.current) abortRef.current();
  };

  return { isStreaming, streamingContent, sendMessage, stopStream };
}
