import "~/styles/globals.css";

import { type Metadata } from "next";
import localFont from "next/font/local";
import { Space_Grotesk } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";

import { MobileNav } from "~/components/mobile-nav";
import { TRPCReactProvider } from "~/trpc/react";
import { routing } from "~/i18n/routing";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    icons: [{ rel: "icon", url: "/favicon.ico" }],
  };
}

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

// Custom display font (variable) - update the path to match your font file
// Variable fonts contain all weights/styles in a single file
const customDisplayFont = localFont({
  src: "../../../public/fonts/Romana Pro.woff2", // or .woff, .ttf, .otf
  variable: "--font-display",
  display: "swap",
  fallback: ["var(--font-space-grotesk)"],
  // Optional: specify weight range if known (e.g., "100 900" or "400 700")
  // weight: "100 900",
});

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${spaceGrotesk.variable} ${customDisplayFont.variable} dark`}
    >
      <body>
        <TRPCReactProvider>
          <NextIntlClientProvider>
            <MobileNav />
            {children}
          </NextIntlClientProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
