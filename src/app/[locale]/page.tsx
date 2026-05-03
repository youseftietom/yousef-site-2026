export const revalidate = 0;
import { setRequestLocale } from "next-intl/server";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import ClientShell from "@/components/layout/client-shell";
import PageBuilder from "@/components/layout/page-builder";
import { client } from "../../../sanity/lib/client";
import { homepageQuery } from "../../../sanity/lib/queries";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const homepageData = await client.fetch(homepageQuery);

  return (
    <ClientShell>

      <main className="noise-overlay">
        <PageBuilder sections={homepageData?.pageBuilder || null} />
      </main>

    </ClientShell>
  );
}
