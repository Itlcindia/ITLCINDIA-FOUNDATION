import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { ScrollProgressBar } from '@/components/layout/scroll-progress-bar';
import { RouteProgressBar } from '@/components/layout/route-progress-bar';

import { DonationModalProvider } from '@/context/donation-modal-context';
import { DonationModal } from '@/components/donation/donation-modal';

export const metadata: Metadata = {
  title: 'ITLC Foundation Hub',
  description: 'Serving Humanity. Protecting Nature. Saving Lives.',
  verification: {
    google: 'PGhV84C11AofLbbgcqGSqWfOF6Su5x10bykyx3E3Ptg',
  },
  other: {
    'google-adsense-account': 'ca-pub-5020716602157264',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="PGhV84C11AofLbbgcqGSqWfOF6Su5x10bykyx3E3Ptg" />

        {/* Google AdSense Meta Verification */}
        <meta name="google-adsense-account" content="ca-pub-5020716602157264" />

        {/* Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5020716602157264"
          crossOrigin="anonymous"
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Poppins:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <DonationModalProvider>
          <Suspense fallback={null}>
            <RouteProgressBar />
          </Suspense>
          <ScrollProgressBar />
          <div className="relative flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <DonationModal />
          <Toaster />
        </DonationModalProvider>
      </body>
    </html>
  );
}
