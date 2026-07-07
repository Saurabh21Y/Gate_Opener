import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Assistant — Venture Builders',
  description: 'ChatGPT-like AI assistant with multiple sessions and streaming responses.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: '100%' }}>
      <body className={inter.className} style={{ height: '100%' }}>
        {children}
      </body>
    </html>
  );
}
