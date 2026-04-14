import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Navbar from '@/components/layout/Navbar';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Eden Ryder Lee — Full-Stack Developer & Automation Architect',
  description:
    'Full-Stack Developer & Automation Architect building exceptional web experiences and automating complex workflows.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="min-h-full bg-[#111111] text-[#f0f0f0]">
        <SmoothScrollProvider>
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
