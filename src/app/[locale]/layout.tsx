import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Inter, Syne, Cairo, Tajawal } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import ThemeInjector from "@/components/providers/theme-injector";
import { isRtl, Locale, locales } from "@/i18n/config";
import { notFound } from "next/navigation";
import { client } from "../../../sanity/lib/client";
import { siteSettingsQuery } from "../../../sanity/lib/queries";

// استيراد المكونات الأساسية
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

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
  
  // جلب إعدادات الموقع (اللي ضفنا فيها السوشيال ميديا والأيقونات)
  const siteSettings = await client.fetch(siteSettingsQuery);

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${inter.variable} ${syne.variable} ${cairo.variable} ${tajawal.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-text-primary" suppressHydrationWarning>
        <ThemeInjector colors={siteSettings} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages}>
            {/* 1. الناف بار يظهر فوق في كل الصفحات */}
            <Navbar />

            {/* 2. محتوى الصفحة المتغير */}
            <div className="flex-grow">
              {children}
            </div>

            {/* 3. الفوتر يظهر تحت وبنمرر له البيانات اللي جبناها من Sanity */}
            <Footer socials={siteSettings?.socialLinks || []} />
            
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}