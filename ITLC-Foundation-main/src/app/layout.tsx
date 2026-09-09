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
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' },
      { url: '/ref/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
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
        {/* Favicon & Web Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Razorpay Standard Checkout Gateway Script */}
        <script async src="https://checkout.razorpay.com/v1/checkout.js" />

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
