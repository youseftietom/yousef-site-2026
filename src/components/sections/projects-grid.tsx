"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import TextReveal from "@/components/animations/text-reveal";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Plus, Images, Play } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

function ProjectCardItem({ project, locale, finalCategories }: { project: any, locale: string, finalCategories: any[] }) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [mobileSlideIdx, setMobileSlideIdx] = useState(0);
  const [isTouchPlaying, setIsTouchPlaying] = useState(false);
  const mobileVideoRef = useRef<HTMLVideoElement>(null);
  const touchStartTime = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const projectTitle = locale === "ar" ? project.title_ar || project.title : project.title;
  const imageUrl = project.thumbnail?.asset?.url || project.thumbnail || "";
  const projectSlug = project.slug?.current || project.slug || "";
  
  const allSlides = useMemo(() => {
    const slides: string[] = [];
    if (imageUrl) slides.push(imageUrl);
    if (project.galleryImages && project.galleryImages.length > 0) {
      project.galleryImages.forEach((img: any) => {
        if (img?.asset?.url) slides.push(img.asset.url);
      });
    }
    return slides;
  }, [imageUrl, project.galleryImages]);

  const imagesCount = allSlides.length;
  
  const matchedCategory = finalCategories.find((c: any) => c.value === project.category);
  const categoryName = matchedCategory 
    ? (locale === "ar" ? matchedCategory.title_ar : matchedCategory.title_en)
    : (project.category?.replace("-", " ") || "Design");

  useEffect(() => {
    let interval: any;
    if (isHovered && project.hoverType === "slider" && imagesCount > 1) {
      interval = setInterval(() => {
        setCurrentImgIdx((prev) => (prev + 1) % imagesCount);
      }, 1500); 
    } else {
      setCurrentImgIdx(0); 
    }
    return () => clearInterval(interval);
  }, [isHovered, project.hoverType, imagesCount]);


  const handleMobileScroll = (e: any) => {
    const { scrollLeft, clientWidth } = e.target;
    const newIndex = Math.round(Math.abs(scrollLeft) / clientWidth);
    setMobileSlideIdx(newIndex);
  };

  // Dribbble-style: لما تلمس الكارت الفيديو يشتغل، لما ترفع إصبعك يوقف
  const hasVideo = project.hoverType === "video" && project.hoverVideo?.asset?.url;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartTime.current = Date.now();
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    if (!hasVideo) return;
    setIsTouchPlaying(true);
    mobileVideoRef.current?.play().catch(() => {});
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const duration = Date.now() - touchStartTime.current;
    const dx = Math.abs(e.changedTouches[0].clientX - touchStartX.current);
    const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
    const moved = dx > 10 || dy > 10; // اعتبره scroll لو تحرك أكتر من 10px

    if (hasVideo) {
      mobileVideoRef.current?.pause();
      if (mobileVideoRef.current) mobileVideoRef.current.currentTime = 0;
      setIsTouchPlaying(false);
    }

    // روح للصفحة بس لو كان tap حقيقي (سريع + ما اتحركش)
    if (!moved && duration < 250 && projectSlug) {
      router.push(`/${locale}/projects/${projectSlug}`);
    }
    e.preventDefault();
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative h-[350px] rounded-[1.5rem] overflow-hidden bg-surface border border-border/40 shadow-sm"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-full w-full bg-surface overflow-hidden">
        
        {/* البادج اللي فوق */}
        <div className="absolute top-4 right-4 z-50 flex gap-2 pointer-events-none">
          {project.hoverType === "slider" && imagesCount > 1 && (
            <div className="bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 shadow-lg">
              <Images size={14} />
              <span>{imagesCount}</span>
            </div>
          )}
          {project.hoverType === "video" && project.hoverVideo?.asset?.url && (
            <div className="bg-black/40 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 border border-white/20 shadow-lg">
              <Play size={14} className="fill-white" />
            </div>
          )}
        </div>

        {/* 1. الموبايل */}
        <div 
          className="md:hidden absolute inset-0 z-20 flex overflow-x-auto overflow-y-hidden snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
          onScroll={handleMobileScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {project.hoverType === "slider" && imagesCount > 1 ? (
            allSlides.map((slideUrl: string, idx: number) => (
              <div key={idx} className="relative min-w-full h-full snap-center">
                <Image src={slideUrl} alt={`Slide ${idx}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover pointer-events-none" />
              </div>
            ))
          ) : hasVideo ? (
            // Dribbble-style: thumbnail + play badge، لما تلمس يشتغل الفيديو
            <div
              className="relative min-w-full h-full snap-center select-none"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Thumbnail */}
              <Image
                src={imageUrl}
                alt={projectTitle}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover pointer-events-none transition-opacity duration-300 ${
                  isTouchPlaying ? "opacity-0" : "opacity-100"
                }`}
              />
              {/* الفيديو بيظهر لما تلمس */}
              <video
                ref={mobileVideoRef}
                src={project.hoverVideo.asset.url}
                loop
                muted
                playsInline
                preload="none"
                className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-300 ${
                  isTouchPlaying ? "opacity-100" : "opacity-0"
                }`}
              />
              {/* Play badge في النص */}
              <div
                className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${
                  isTouchPlaying ? "opacity-0" : "opacity-100"
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-xl">
                  <Play size={22} className="fill-white text-white ml-1" />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative min-w-full h-full snap-center">
              <Image src={imageUrl} alt={projectTitle} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover pointer-events-none" />
            </div>
          )}
        </div>

        {/* 2. الديسكتوب */}
        <div className="hidden md:block absolute inset-0 z-10">
          <Image src={imageUrl} alt={projectTitle} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 z-0" />
          <div className={`absolute inset-0 z-10 transition-opacity duration-500 bg-black/20 ${isHovered && project.hoverType !== "none" ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            {project.hoverType === "video" && project.hoverVideo?.asset?.url && isHovered && (
              <video src={project.hoverVideo.asset.url} autoPlay loop muted playsInline preload="none" className="w-full h-full object-cover" />
            )}
            {project.hoverType === "slider" && imagesCount > 1 && (
              <div className="absolute inset-0 w-full h-full">
                {allSlides.map((slideUrl: string, idx: number) => (
                  <Image key={idx} src={slideUrl} alt={`Slide ${idx}`} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority={idx === 0}
                    className={`absolute inset-0 object-cover transition-all duration-1000 ease-in-out ${idx === currentImgIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"}`} />
                ))}
              </div>
            )}
          </div>
          {projectSlug && <Link href={`/${locale}/projects/${projectSlug}`} className="absolute inset-0 z-50" />}
        </div>

        {/* 3. نقط انستجرام */}
        {project.hoverType === "slider" && imagesCount > 1 && (
          <div className="md:hidden absolute bottom-3 left-1/2 -translate-x-1/2 z-50 flex gap-1.5 pointer-events-none">
            {allSlides.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                  idx === mobileSlideIdx ? "w-4 bg-white" : "w-1.5 bg-white/40 backdrop-blur-sm"
                }`}
              />
            ))}
          </div>
        )}

        {/* 4. النصوص */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500 z-30 pointer-events-none" />
        <div className="absolute inset-0 p-6 pb-8 md:pb-6 flex flex-col justify-end z-40 pointer-events-none">
          <span className="text-white font-bold text-[10px] uppercase tracking-[0.2em] mb-2" style={{ textShadow: "0px 2px 5px rgba(0,0,0,0.9)" }}>
            {categoryName}
          </span>
          <div className="flex items-end justify-between gap-3">
            <h3 className="text-white font-heading text-lg font-bold leading-tight line-clamp-2">{projectTitle}</h3>
            <div className="w-8 h-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white shrink-0 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>

      </div>
      
      <style jsx>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </motion.article>
  );
}

export default function ProjectsGrid({ data }: { data?: any }) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const [activeFilter, setActiveFilter] = useState("all");
  const [showAll, setShowAll] = useState(false);

  const heading = (locale === "ar" ? data?.heading_ar : data?.heading_en) || t("title");
  const subtitle = (locale === "ar" ? data?.subtitle_ar : data?.subtitle_en) || t("subtitle");
  const realProjects = data?.projects || [];
  const showFilters = data?.showFilters ?? true;
  const maxProjects = data?.maxProjects || 6;

  // 👇 التعديل الأول: استخدمنا useMemo عشان المصفوفة تفضل ثابتة وماتعلقش الـ useEffect
  const finalCategories = useMemo(() => {
    const dynamicCategories = data?.categories && data.categories.length > 0 
      ? data.categories 
      : [
          { title_en: "Graphic Design", title_ar: "تصميم جرافيك", value: "graphic-design" },
          { title_en: "Video Editing", title_ar: "مونتاج فيديو", value: "video-editing" },
          { title_en: "UI/UX", title_ar: "واجهة المستخدم", value: "ui-ux" },
        ];
    return [
      { title_en: "All", title_ar: "الكل", value: "all" },
      ...dynamicCategories
    ];
  }, [data?.categories]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith("#projects-")) {
        const category = hash.replace("#projects-", "");
        const exists = finalCategories.some((c) => c.value === category);
        if (exists) {
          setActiveFilter(category);
          setShowAll(true);
        }
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [finalCategories]);

  const filtered = useMemo(() => {
    return activeFilter === "all"
      ? realProjects
      : realProjects.filter((p: any) => p.category === activeFilter);
  }, [activeFilter, realProjects]);

  const visibleProjects = showAll || maxProjects === 0 
    ? filtered 
    : filtered.slice(0, maxProjects);

  return (
    <section id="projects" className="section-spacing relative bg-transparent text-text-primary">
      <div className="mx-auto max-w-[1400px] px-6">
        
        <div className="mb-16 text-center">
          <TextReveal as="h2" className="font-heading text-4xl md:text-6xl font-bold text-text-primary justify-center tracking-tight">
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

        {showFilters && (
          <div className="flex flex-wrap justify-center gap-2 mb-12 bg-surface/40 backdrop-blur-md p-2 rounded-full max-w-fit mx-auto border border-border/40 shadow-sm">
            {finalCategories.map((cat: any) => (
              <button
                key={cat.value}
                onClick={() => {
                  setActiveFilter(cat.value);
                  setShowAll(false);
                  
                  // 👇 التعديل التاني: بنمسح/نغير الـ Hash القديم من الرابط عشان الفلتر ميفضلش مسجون فيه
                  const newHash = cat.value === "all" ? window.location.pathname : `#projects-${cat.value}`;
                  window.history.replaceState(null, "", newHash);
                }}
                className={`relative px-6 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-300 ${
                  activeFilter === cat.value 
                    ? "text-white" 
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {activeFilter === cat.value && (
                  <motion.div layoutId="activeTab" className="absolute inset-0 bg-primary z-0 rounded-full" />
                )}
                <span className="relative z-10">
                  {locale === "ar" ? cat.title_ar : cat.title_en}
                </span>
              </button>
            ))}
          </div>
        )}

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {visibleProjects.map((project: any, i: number) => (
              <ProjectCardItem 
                key={project._id || i} 
                project={project} 
                locale={locale} 
                finalCategories={finalCategories} 
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {!showAll && maxProjects > 0 && filtered.length > maxProjects && (
          <div className="mt-16 text-center">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-surface text-text-primary border border-border/60 rounded-full text-sm font-bold hover:bg-primary hover:border-primary hover:text-white transition-all duration-300 group shadow-sm"
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