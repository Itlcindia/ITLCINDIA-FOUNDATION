import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
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
      { url: '/favicon.png?v=2', type: 'image/png', sizes: '32x32' },
      { url: '/logo-icon.png?v=2', type: 'image/png', sizes: '192x192' },
      { url: '/favicon.ico?v=2', sizes: 'any' },
      { url: '/ref/logo.png', type: 'image/png' },
    ],
    shortcut: '/favicon.ico?v=2',
    apple: [
      { url: '/apple-touch-icon.png?v=2', sizes: '180x180', type: 'image/png' },
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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon & Web Icons (ITLC Official Foundation Logo) */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png?v=2" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo-icon.png?v=2" />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2" />

        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="PGhV84C11AofLbbgcqGSqWfOF6Su5x10bykyx3E3Ptg" />

        {/* Google AdSense Meta Verification */}
        <meta name="google-adsense-account" content="ca-pub-5020716602157264" />

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
        {/* Google Analytics 4 Tag (gtag.js) */}
        <Script
          id="google-analytics-tag"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-5Q2MDHH8H8"
        />
        <Script
          id="google-analytics-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5Q2MDHH8H8');
            `,
          }}
        />

        {/* Google Tag Manager Script (Hydration-safe Next.js Script) */}
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-WZZ54M84');`,
          }}
        />

        {/* Razorpay Standard Checkout Gateway Script */}
        <Script
          id="razorpay-checkout"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        {/* Google AdSense Script */}
        <Script
          id="adsbygoogle-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5020716602157264"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WZZ54M84"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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
