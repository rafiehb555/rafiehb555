import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import AIChatProvider from '@/components/layout/AIChatProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'EHB - Everything Hub Business',
  description: 'Your one-stop platform for education, health, and shopping services.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <AIChatProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
