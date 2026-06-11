import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Navbar from '@/components/layout/Navbar';
import CustomCursor from '@/components/ui/CustomCursor';
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ryderlee.me';
const SITE_TITLE = 'Eden Ryder Lee — Full-Stack Developer & Automation Architect';
const SITE_DESCRIPTION =
  'Full-Stack Developer & Automation Architect building exceptional web experiences and automating complex workflows.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    url: '/',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: 'Eden Ryder Lee',
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
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
      <head>
        {/* Warm up TCP/TLS to YouTube domains so the facade iframes
            (and thumbnail <img>) connect faster when they reveal.
            Does NOT change the facade's onLoad timing. */}
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="min-h-full bg-[#111111] text-[#f0f0f0] cursor-none">
        <SmoothScrollProvider>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
