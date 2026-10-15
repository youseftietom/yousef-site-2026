import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { client } from "../../../../../sanity/lib/client";
import { projectBySlugQuery } from "../../../../../sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import BackButton from "@/components/ui/back-button";
import { ExternalLink, FileText } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

function getEmbedInfo(url: string) {
  if (!url) return { embedUrl: "", isVertical: false };

  const isVertical = url.includes("shorts/") || url.includes("reel") || url.includes("tiktok.com");

  let embedUrl = url;

  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([^&?]{11})/);
  if (ytMatch && ytMatch[1]) {
    embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&fs=1`; // إضافة fs=1 لضمان تفعيل التكبير في يوتيوب
  } else {
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}?title=0&byline=0&portrait=0`;
    }
  }

  return { embedUrl, isVertical };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const t = await getTranslations("projectDetail");

  const project = await client.fetch(projectBySlugQuery, { slug: slug });

  if (!project) notFound();

  const caseStudy = locale === "ar" ? project.caseStudy_ar : project.caseStudy_en;

  const horizontalVideos: any[] = [];
  const otherMedia: any[] = [];

  const hasMultipleImages = project.mediaGallery && project.mediaGallery.length > 0;

  if (hasMultipleImages) {
    project.mediaGallery.forEach((item: any) => {
      if (item._type === "videoElement" && item.url) {
        const { isVertical } = getEmbedInfo(item.url);
        if (!isVertical) {
          horizontalVideos.push(item);
        } else {
          otherMedia.push(item);
        }
      } else {
        otherMedia.push(item);
      }
    });
  } else if (project.thumbnail?.asset?.url) {
    otherMedia.push({
      _type: "image",
      asset: project.thumbnail.asset
    });
  }

  return (
    <main className="min-h-screen bg-background pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">

        <BackButton locale={locale} text={t("backToProjects")} />

        <div className="mt-16 flex flex-col gap-6">
          <div className="flex items-center gap-3 text-text-secondary text-xs font-bold uppercase tracking-widest">
            <span>{project.category}</span>
            {project.date && (
              <>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>{new Date(project.date).getFullYear()}</span>
              </>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-4xl md:text-7xl font-heading font-bold">{project.title}</h1>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {project.liveLink && (
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold transition-all duration-300 hover:shadow-[0_8px_20px_-6px_rgba(var(--primary),0.5)] hover:-translate-y-1"
                >
                  <ExternalLink size={20} />
                  {locale === "ar" ? "زيارة المشروع" : "Visit Project"}
                </a>
              )}

              {project.projectPdf?.asset?.url && (
                <a
                  href={project.projectPdf.asset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-surface border border-border/60 hover:border-primary/50 text-text-primary rounded-2xl font-bold transition-all duration-300 hover:bg-primary/5 hover:shadow-lg hover:-translate-y-1"
                >
                  <FileText size={20} className="text-primary" />
                  {locale === "ar" ? "عرض التفاصيل (PDF)" : "View Details (PDF)"}
                </a>
              )}
            </div>
          </div>

          {project.tools && project.tools.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {project.tools.map((tool: any, i: number) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-surface rounded-full border border-border/40 shadow-sm">
                  {tool.icon?.asset?.url && (
                    <Image src={tool.icon.asset.url} alt={tool.name || "Icon"} width={18} height={18} className="object-contain" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-tight">{tool.name}</span>
                </div>
              ))}
            </div>
          )}

          <p className="mt-8 text-lg text-text-secondary leading-relaxed max-w-4xl whitespace-pre-wrap">
            {locale === "ar" ? project.description_ar : project.description_en}
          </p>
        </div>

        {caseStudy && (
          <div className="mt-20 prose prose-lg dark:prose-invert max-w-4xl prose-img:rounded-3xl prose-headings:font-heading">
            <PortableText value={caseStudy} />
          </div>
        )}

        {horizontalVideos.length > 0 && (
          <div className="mt-24 flex flex-col gap-12">
            {horizontalVideos.map((item, idx) => {
              const { embedUrl } = getEmbedInfo(item.url);
              return (
                <div key={`h-vid-${idx}`} className="w-full rounded-[2.5rem] overflow-hidden border border-border/20 shadow-2xl bg-surface/30 p-2 md:p-4">
                  <div className="aspect-video w-full bg-black relative rounded-2xl overflow-hidden">
                    <iframe
                      src={embedUrl}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                      allowFullScreen={true}
                    ></iframe>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {otherMedia.length > 0 && (
          <div className={horizontalVideos.length > 0 ? "mt-12" : "mt-24"}>
            <div className={project.detailsLayout === "grid" ? "columns-1 md:columns-2 gap-8" : "flex flex-col gap-12"}>
              {otherMedia.map((item: any, idx: number) => {

                if (item._type === "videoElement" && item.url) {
                  const { embedUrl } = getEmbedInfo(item.url);
                  return (
                    <div key={item._key || idx} className="rounded-3xl overflow-hidden border border-border/10 bg-surface/20 shadow-md break-inside-avoid mb-8 w-full max-w-[400px] mx-auto">
                      <div className="aspect-[9/16] w-full bg-black relative">
                        <iframe
                          src={embedUrl}
                          className="absolute inset-0 w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
                          allowFullScreen={true}
                        ></iframe>
                      </div>
                    </div>
                  );
                }

                if (item._type === "image" && item.asset?.url) {
                  return (
                    <div key={item._key || idx} className="rounded-3xl overflow-hidden border border-border/10 bg-surface/20 shadow-md break-inside-avoid mb-8">
                      <Image src={item.asset.url} alt={`Gallery Item ${idx}`} width={1400} height={1000} className="w-full h-auto" />
                    </div>
                  );
                }
                return null;
              })}
            </div>
          </div>
        )}

        {project.embedCode && (
          <div className="mt-24 pt-16 border-t border-border/20">
            <div className="mb-8 text-center md:text-start max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-3">
                {locale === "ar" ? "جرب النظام بنفسك (تفاعلي)" : "Interactive Prototype"}
              </h3>
              <p className="text-text-secondary text-base md:text-lg">
                {locale === "ar"
                  ? "تقدر تتصفح وتجرب تصميم السيستم أو الأبلكيشن لايف من خلال النموذج التفاعلي ده:"
                  : "You can navigate and test the live system/application design right here:"}
              </p>
            </div>

            <div className="w-full rounded-[2rem] overflow-hidden border border-border/30 shadow-2xl bg-surface/30 p-2">
              <div
                className="w-full [&>iframe]:w-full [&>iframe]:min-h-[500px] md:[&>iframe]:min-h-[700px] [&>iframe]:rounded-xl"
                dangerouslySetInnerHTML={{ __html: project.embedCode }}
              />
            </div>
          </div>
        )}

      </div>
    </main>
  );
}