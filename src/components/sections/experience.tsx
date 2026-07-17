"use client";

import React from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import TextReveal from "@/components/animations/text-reveal";

const defaultJobs = [
  {
    company_en: "Creative Vision Studio",
    company_ar: "استوديو الرؤية الإبداعية",
    role_en: "Graphic Designer",
    role_ar: "مصمم جرافيك",
    duration_en: "2021 — 2022",
    duration_ar: "2021 — 2022",
    description_en: "Created social media content, marketing materials, and promotional designs for various brands while maintaining visual consistency and quality.",
    description_ar: "إنشاء محتوى لوسائل التواصل الاجتماعي والمواد التسويقية مع الحفاظ على الجودة والهوية البصرية.",
    techStack: ["Photoshop", "Illustrator"],
    companyLogo: null
  }
];

export default function Experience({ data }: { data?: any }) {
  const t = useTranslations("experience");
  const locale = useLocale();
  const isRtl = locale === "ar";
  const jobs = data?.jobs?.length > 0 ? data.jobs : defaultJobs;

  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <section id="experience" className="section-spacing relative" dir={isRtl ? "rtl" : "ltr"}>
      {/* كبرنا عرض الكونتينر سنة عشان الكروت تاخد راحتها بالعرض بدل الطول */}
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        
        <div className="mb-10 text-center">
          <TextReveal as="h2" className="font-heading text-3xl md:text-4xl font-bold text-text-primary justify-center flex">
            {(isRtl ? data?.heading_ar : data?.heading_en) || t("title")}
          </TextReveal>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-text-secondary text-sm mt-2 max-w-lg mx-auto">
            {(isRtl ? data?.subtitle_ar : data?.subtitle_en) || t("subtitle")}
          </motion.p>
        </div>

        <div ref={containerRef} className="relative max-w-4xl mx-auto">
          
          {data?.showTimeline !== false && (
            <>
              {/* الخط قربناه شوية */}
              <div className="absolute w-[2px] bg-white/5 top-0 bottom-0 start-[8px] md:start-[16px]" />
              <motion.div 
                style={{ scaleY }}
                className="absolute w-[2px] bg-primary top-0 bottom-0 start-[8px] md:start-[16px] origin-top shadow-[0_0_10px_var(--primary-glow)]" 
              />
            </>
          )}

          {/* المسافة بين الكروت بقت ألمّ (space-y-5 md:space-y-6) */}
          <div className="space-y-5 md:space-y-6">
            {jobs.map((job: any, i: number) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative ${data?.showTimeline !== false ? "ps-8 md:ps-12" : ""}`}
              >
                {/* النقطة صغرت ومكانها اتظبط مع الخط */}
                {data?.showTimeline !== false && (
                  <div className="absolute start-[3px] md:start-[11px] top-6 w-2.5 h-2.5 rounded-full bg-background border-[1.5px] border-primary z-20 shadow-[0_0_8px_rgba(var(--primary-rgb),0.6)]" />
                )}
                
                {/* الكارت: الحواف بقت حادة شوية (rounded-2xl) والـ Padding قل (p-4 md:p-5) */}
                <div className="glass-card p-4 md:p-5 hover:bg-white/[0.02] transition-all duration-300 border border-white/5 relative group overflow-hidden flex flex-col h-full rounded-2xl shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex-grow">
                    
                    {/* الجزء العلوي: العنوان والشركة + اللوجو */}
                    <div className="flex justify-between items-start gap-3 mb-2 md:mb-3">
                      <div>
                        {/* حجم الخط بقى مناسب جداً (text-base md:text-xl) */}
                        <h3 className="text-base md:text-xl font-bold text-text-primary group-hover:text-primary transition-colors duration-300">
                          {isRtl ? job.role_ar : job.role_en}
                        </h3>
                        <p className="text-primary text-[11px] md:text-sm font-medium mt-0.5">
                          {isRtl ? job.company_ar : job.company_en}
                        </p>
                      </div>

                      {/* اللوجو صغر وبقى أنيق جداً */}
                      {data?.showCompanyLogo !== false && job.companyLogo?.asset?.url && (
                        <div className="flex-shrink-0 bg-white/5 p-1 md:p-1.5 rounded-lg border border-white/10">
                          <img 
                            src={job.companyLogo.asset.url} 
                            alt="Company Logo" 
                            className="h-6 w-6 md:h-8 md:w-8 object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* الوصف صغر سِنة عشان يدي مساحة نظيفة */}
                    <p className="text-text-secondary text-xs md:text-[13px] leading-relaxed max-w-2xl whitespace-pre-line">
                      {isRtl ? job.description_ar : job.description_en}
                    </p>
                  </div>

                  {/* الجزء السفلي: التقنيات + التاريخ */}
                  <div className="relative z-10 mt-3 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                    
                    {/* التقنيات */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {data?.showTechStack !== false && job.techStack && job.techStack.length > 0 && (
                        job.techStack.map((tool: string) => (
                          <span key={tool} className="px-2 py-1 text-[9px] md:text-[10px] uppercase font-bold rounded bg-primary/10 text-primary border border-primary/20 shadow-sm">
                            {tool}
                          </span>
                        ))
                      )}
                    </div>

                    {/* التاريخ صغر وبقى Badge شيك جداً */}
                    <div className="ms-auto flex-shrink-0">
                      <span className="inline-block text-text-muted text-[9px] md:text-[10px] font-bold bg-white/5 md:bg-surface-hover px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg border border-white/10 whitespace-nowrap">
                        {isRtl ? job.duration_ar : job.duration_en}
                      </span>
                    </div>
                    
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}