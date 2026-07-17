import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter, Syne, Cairo, Tajawal } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ThemeInjector from "@/components/providers/theme-injector";
import { isRtl, Locale, locales } from "@/i18n/config";
import { notFound } from "next/navigation";
import { client } from "../../../sanity/lib/client";
import { siteSettingsQuery } from "../../../sanity/lib/queries";

// المسار النسبي السليم اللي حل المشكلة 🚀
import Navbar from "../../components/layout/navbar";
import Footer from "@/components/layout/footer";
import SplashScreen from "@/components/layout/splash-screen"; 

export const revalidate = 0;

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  weight: ["400", "500", "700", "800"],
  subsets: ["arabic", "latin"],
  variable: "--font-tajawal",
  display: "swap",
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  const siteSettings = await client.fetch(
    siteSettingsQuery,
    {},
    { cache: "no-store", next: { revalidate: 0 } }
  );
  
  const title = siteSettings?.siteTitle || "Youssef Portfolio";
  const description = locale === "ar" ? siteSettings?.metaDescription_ar : siteSettings?.metaDescription_en;
  const keywords = locale === "ar" ? siteSettings?.keywords_ar : siteSettings?.keywords_en;
  const ogImageUrl = siteSettings?.ogImage?.asset?.url;

  return {
    title: title,
    description: description,
    keywords: keywords,
    openGraph: {
      title: title,
      description: description,
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      images: ogImageUrl ? [ogImageUrl] : [],
    }
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = isRtl(locale as Locale) ? "rtl" : "ltr";
  
  const siteSettings = await client.fetch(
    siteSettingsQuery,
    {},
    { cache: "no-store", next: { revalidate: 0 } }
  );

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${syne.variable} ${cairo.variable} ${tajawal.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-text-primary" suppressHydrationWarning>
        <ThemeInjector colors={siteSettings} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            
            <SplashScreen />
            
            <Navbar navLinks={siteSettings?.navLinks || []} settings={siteSettings} />

            <main className="flex-grow flex flex-col min-h-[120vh]">
              {children}
            </main>

            <Footer socials={siteSettings?.socialLinks || []} settings={siteSettings} />
            
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}