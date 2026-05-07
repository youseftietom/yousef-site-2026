import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { client } from "../../../../../sanity/lib/client";
import { projectBySlugQuery } from "../../../../../sanity/lib/queries";
import urlBuilder from "@sanity/image-url";

// استيراد زرار الرجوع الذكي اللي عملناه
import BackButton from "@/components/ui/back-button"; 

const builder = urlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

export default async function ProjectDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string; locale: string }> 
}) {
  const { slug, locale } = await params;
  const t = await getTranslations("projectDetail");
  
  const project = await client.fetch(projectBySlugQuery, { slug: slug });

  if (!project) notFound();

  const projectTitle = project.title || "Project Details";
  const categoryName = project.category?.replace("-", " ") || "Design";

  return (
    // التعديل 1: زودنا pt-32 عشان الناف بار مايغطيش على زرار الرجوع
    <main className="min-h-screen bg-background text-text-primary pt-32 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        
        <div className="mb-8">
          {/* التعديل 2: استخدمنا المكون الجديد اللي بيعالج مشكلة الرجوع للينكات اللي فيها # */}
          <BackButton locale={locale} text={t("backToProjects")} />
        </div>

        {project.thumbnail && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[2rem] overflow-hidden mb-12 shadow-2xl border border-border/40">
            <Image src={urlFor(project.thumbnail).url()} alt={projectTitle} fill className="object-cover" priority />
          </div>
        )}

        <div className="mb-16">
          <span className="text-text-secondary text-xs font-bold uppercase tracking-[0.2em] mb-4 block">
            {categoryName}
          </span>
          
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-8">{projectTitle}</h1>
          
          {project.tools && project.tools.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8">
              {project.tools.map((tool: string) => (
                <span key={tool} className="px-4 py-1.5 rounded-full bg-surface border border-border/60 text-text-secondary text-xs font-medium uppercase tracking-wider">
                  {tool}
                </span>
              ))}
            </div>
          )}
          
          <p className="text-text-secondary text-lg leading-relaxed max-w-4xl whitespace-pre-wrap">
            {locale === "ar" ? project.description_ar : project.description_en}
          </p>
        </div>

      </div>
    </main>
  );
}