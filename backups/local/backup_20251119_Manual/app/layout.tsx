import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/error-boundary";
import "@/lib/service-worker"; // Initialize service worker

export const metadata: Metadata = {
  title: {
    default: "ACTREC Telephone Directory",
    template: "%s | ACTREC Directory"
  },
  description: "Advanced Centre for Treatment, Research, and Education in Cancer - Consolidated Telephone Directory. Search and manage contacts for medical administration, research departments, and IT services.",
  keywords: ["ACTREC", "telephone directory", "cancer research", "medical contacts", "oncology", "bioinformatics", "research collaboration"],
  authors: [{ name: "ACTREC IT Department" }],
  creator: "ACTREC",
  publisher: "Advanced Centre for Treatment, Research and Education in Cancer",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'http://localhost:3000',
    title: 'ACTREC Telephone Directory',
    description: 'Advanced Centre for Treatment, Research, and Education in Cancer - Consolidated Telephone Directory',
    siteName: 'ACTREC Directory',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ACTREC Telephone Directory',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACTREC Telephone Directory',
    description: 'Advanced Centre for Treatment, Research, and Education in Cancer - Consolidated Telephone Directory',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-site-verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
