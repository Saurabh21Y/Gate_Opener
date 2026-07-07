import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Resume Builder — Venture Builders',
  description:
    'Build ATS-friendly resumes with AI. Fill in your details and let GPT-4o craft the perfect resume.',
  keywords: ['resume builder', 'AI resume', 'ATS resume', 'GPT-4o', 'career'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
