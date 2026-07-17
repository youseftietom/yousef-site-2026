export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { setRequestLocale } from "next-intl/server";
import ClientShell from "@/components/layout/client-shell";
import PageBuilder from "@/components/layout/page-builder";
import { client } from "../../../sanity/lib/client";
import { homepageQuery, siteSettingsQuery } from "../../../sanity/lib/queries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // 1. جلب داتا الصفحة (بدون كاش)
  const homepageData = await client.fetch(
    homepageQuery,
    {},
    { cache: "no-store", next: { revalidate: 0 } }
  );

  // 2. جلب داتا الإعدادات (عشان نبعتها لزرار السعر)
  const siteSettings = await client.fetch(
    siteSettingsQuery,
    {},
    { cache: "no-store", next: { revalidate: 0 } }
  );

  return (
    <ClientShell>
      <main className="noise-overlay">
        {/* 🔴 التعديل هنا: بعتنا الـ settings جوه الـ PageBuilder */}
        <PageBuilder 
          sections={homepageData?.pageBuilder || null} 
          settings={siteSettings} 
        />
      </main>
    </ClientShell>
  );
}