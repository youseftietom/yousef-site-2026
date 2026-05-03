"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import TextReveal from "@/components/animations/text-reveal";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";

const categories = [
  { key: "filterAll", value: "all" },
  { key: "filterGraphic", value: "graphic-design" },
  { key: "filterVideo", value: "video-editing" },
  { key: "filterUiux", value: "ui-ux" },
  { key: "filterMotion", value: "motion-graphics" },
];

export default function ProjectsGrid({ data }: { data?: any }) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAll, setShowAll] = useState(false); // حالة إظهار الكل

  const heading = (locale === "ar" ? data?.heading_ar : data?.heading_en) || t("title");
  const subtitle = (locale === "ar" ? data?.subtitle_ar : data?.subtitle_en) || t("subtitle");
  const realProjects = data?.projects || [];

  // تصفية المشاريع بناءً على القسم المختار
  const filtered = useMemo(() => {
    return activeFilter === "all"
      ? realProjects
      : realProjects.filter((p: any) => p.category === activeFilter);
  }, [activeFilter, realProjects]);

  // تحديد المشاريع التي ستظهر (أول 6 أو الكل)
  const visibleProjects = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id="projects" className="section-spacing relative bg-background">
      <div className="mx-auto max-w-[1400px] px-6">
        
        {/* العناوين */}
        <div className="mb-16 text-center">
          <TextReveal as="h2" className="font-heading text-4xl md:text-5xl font-bold text-text-primary justify-center tracking-tight">
            {heading}
          </TextReveal>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-text-secondary text-base mt-4 max-w-xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* أزرار الفلترة */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => {
                setActiveFilter(cat.value);
                setShowAll(false); // ريست للزرار لما يغير القسم
              }}
              className={`relative px-6 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
                activeFilter === cat.value ? "text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {activeFilter === cat.value && (
                <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary z-0 rounded-full" />
              )}
              <span className="relative z-10">{t(cat.key)}</span>
            </button>
          ))}
        </div>

        {/* الجريد - صغرنا الحجم لـ 4 أعمدة */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project: any, i: number) => {
              const projectTitle = locale === "ar" ? project.title_ar || project.title : project.title;
              const imageUrl = project.thumbnail?.asset?.url || project.thumbnail || "";
              const projectSlug = project.slug?.current || project.slug || "";
              const categoryName = project.category?.replace("-", " ") || "Design";

              return (
                <motion.article
                  key={project._id || i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  // صغرنا الارتفاع لـ 350px والـ rounded لـ 2xl
                  className="group relative h-[350px] rounded-[1.5rem] overflow-hidden bg-surface border border-border/40 shadow-sm"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={imageUrl}
                      alt={projectTitle}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <span className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] mb-2">
                        {categoryName}
                      </span>
                      
                      <div className="flex items-end justify-between gap-3">
                        <h3 className="text-white font-heading text-lg font-bold leading-tight line-clamp-2">
                          {projectTitle}
                        </h3>
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black shrink-0 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                          <ArrowUpRight size={18} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {projectSlug && (
                    <Link href={`/${locale}/projects/${projectSlug}`} className="absolute inset-0 z-50" />
                  )}
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* زر See More - بيظهر بس لو في أكتر من 6 مشاريع */}
        {!showAll && filtered.length > 6 && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-surface border border-border rounded-full text-sm font-bold hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" />
              <span>{t("seeMore") || "See More Projects"}</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}