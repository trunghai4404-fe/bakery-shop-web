import type { Metadata } from "next";
import "@/app/globals.css";
import Providers from "../providers";
import { siteConfig } from "@/config/site";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LoadingProvider } from "@/context/LoadingContext";
import NextTopLoader from 'nextjs-toploader'
import { ToastProvider } from "@/components/toast/ToastProvider";
import AuthManager from "@/redux/auth/authManager";
import { cookies } from "next/headers";
import { LOCALE_COOKIE } from "@/constants/cookies";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

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
      className={`${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <NextIntlClientProvider messages={messages} locale={locale} key={locale}>
          <LoadingProvider>
            <NextTopLoader
              color="linear-gradient(to right, #D99AAA, #9A7668, #9BAF98, #D99AAA)"
              height={3}
              showSpinner={true}
              crawl={true}
              speed={250}
              easing="ease"
              shadow="0 0 10px #D99AAA, 0 0 5px #9A7668"
            />
            <Providers>
              <AuthManager />
              {children}
              <ToastProvider />
            </Providers>
          </LoadingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
