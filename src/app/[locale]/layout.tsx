import Providers from "../providers";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { LoadingProvider } from "@/context/LoadingContext";
import NextTopLoader from 'nextjs-toploader';
import { ToastProvider } from "@/components/toast/ToastProvider";
import AuthManager from "@/redux/auth/authManager";

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<any>;
}>) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();

    return (
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
    );
}
