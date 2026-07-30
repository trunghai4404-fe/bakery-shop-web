import type { Metadata } from "next";
import "../globals.css";
import Providers from "../providers";
import { siteConfig } from "@/config/site";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LoadingProvider } from "@/context/LoadingContext";
import NextTopLoader from 'nextjs-toploader'

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.name,
  metadataBase: new URL(siteConfig.url.base),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <LoadingProvider>
            <NextTopLoader
              color="linear-gradient(to right, #9d4300, #f97316, #adc6ff, #f97316, #9d4300)"
              height={3}
              showSpinner={true}
              crawl={true}
              speed={250}
              easing="ease"
              shadow="0 0 10px #f97316, 0 0 5px #9d4300"
            />
            <Providers>{children}</Providers>
          </LoadingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
