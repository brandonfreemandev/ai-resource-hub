import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Resource Hub — the latest AI tools for developers',
  description:
    'An always-on, AI-curated Resource Hub: the latest releases, why they matter, and how to start — for developers new to freely accessible AI tools.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-[#0b0b0f] text-zinc-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}
