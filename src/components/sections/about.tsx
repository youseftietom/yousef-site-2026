"use client";

import React, { useRef, useEffect } from "react";
import { motion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Download } from "lucide-react";
import TextReveal from "@/components/animations/text-reveal";

// العداد الذكي متأمن 100%
function AnimatedCounter({ text }: { text: string }) {
  if (!text) return <span>0</span>; // سطر الحماية

  const safeText = String(text);
  const match = safeText.match(/(\d+)(\D*)/);
  
  if (!match) return <span>{safeText}</span>;

  const num = parseInt(match[1], 10);
  const suffix = match[2] || "";

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      animate(count, num, { duration: 2.5 });
    }
  }, [count, inView, num]);

  return (
    <span ref={ref} className="inline-flex items-center justify-center">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function About({ data }: { data?: any }) {
  const t = useTranslations("about");
  const locale = useLocale();

  const heading = (locale === "ar" ? data?.heading_ar : data?.heading_en) || t("title");
  const subtitle = (locale === "ar" ? data?.subtitle_ar : data?.subtitle_en) || t("subtitle");
  const bioText = (locale === "ar" ? data?.bio_ar : data?.bio_en) || t("bio");
  
  const showStats = data?.showStats ?? true;
  const showVideo = data?.showVideo ?? true;
  
  const profileImageUrl = data?.profileImage?.asset?.url;
  const cvLink = data?.cvFile?.asset?.url || "#";
  const behanceUrl = data?.behanceUrl || "https://www.behance.net/youseftiete2b1";

  const statsData = data?.statistics?.length > 0 
    ? data.statistics.map((stat: any) => ({
        number: stat.value,
        label: locale === "ar" ? stat.label_ar : stat.label_en
      }))
    : [
        { number: "6", label: locale === "ar" ? "سنوات خبرة" : "Years Experience" },
        { number: "104+", label: locale === "ar" ? "مشاريع" : "Projects" },
        { number: "15+", label: locale === "ar" ? "عملاء" : "Clients" },
      ];

  return (
    <section id="about" className="section-spacing relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <TextReveal as="h2" className="font-heading text-4xl md:text-6xl font-bold text-text-primary justify-center">
            {heading}
          </TextReveal>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.8 }} className="text-text-secondary text-lg mt-4 max-w-2xl mx-auto">
            {subtitle}
          </motion.p>
        </div>

        <div className={`grid grid-cols-1 ${showVideo ? "lg:grid-cols-2" : ""} gap-12 lg:gap-20 items-center`}>
          {showVideo && (
            <motion.div initial={{ opacity: 0, x: -40, scale: 0.95 }} whileInView={{ opacity: 1, x: 0, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="relative group">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden glass-card p-1">
                <div className="w-full h-full rounded-[1.25rem] overflow-hidden bg-surface relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/10 to-pink-500/10" />
                  
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="Profile" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div className="w-32 h-32 rounded-full border-2 border-primary/30 flex items-center justify-center bg-background/50 backdrop-blur-sm" animate={{ scale: [1, 1.05, 1], borderColor: ["rgba(99,102,241,0.2)", "rgba(139,92,246,0.6)", "rgba(99,102,241,0.2)"] }} transition={{ repeat: Infinity, duration: 4 }}>
                        <span className="font-heading text-4xl font-bold text-primary">YS</span>
                      </motion.div>
                    </div>
                  )}

                  {(cvLink !== "#" || behanceUrl) && (
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
                      {cvLink !== "#" && (
                        <motion.a href={cvLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 text-text-primary font-medium shadow-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all duration-300 group/btn" whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                          <Download size={16} className="text-primary group-hover/btn:animate-bounce" />
                          <span className="text-sm whitespace-nowrap">{locale === "ar" ? "تحميل السيرة الذاتية" : "Download CV"}</span>
                        </motion.a>
                      )}
                      {behanceUrl && (
                        <motion.a href={behanceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 text-text-primary font-medium shadow-xl hover:bg-[#1769ff]/20 transition-all duration-300 group/be" whileHover={{ y: -5 }} whileTap={{ scale: 0.95 }}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className="text-[#1769ff]" aria-hidden="true">
                            <path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.477.603.406.27.72.61.94 1.02.22.41.33.9.33 1.47 0 .64-.17 1.18-.502 1.64-.334.46-.83.83-1.49 1.12.895.26 1.57.7 2.022 1.34.45.63.678 1.39.678 2.29 0 .63-.13 1.19-.39 1.67-.26.48-.62.88-1.08 1.2-.46.32-.995.56-1.6.72-.61.16-1.25.24-1.92.24H0V4.51h6.938v-.007zM16.94 16.665c.44.428 1.073.643 1.9.643.59 0 1.1-.148 1.53-.447.428-.3.692-.61.79-.93h2.588c-.413 1.28-1.048 2.2-1.9 2.75-.85.56-1.884.83-3.08.83-.837 0-1.584-.13-2.243-.4-.659-.27-1.22-.65-1.68-1.14-.46-.49-.81-1.08-1.05-1.77-.24-.69-.36-1.45-.36-2.27 0-.8.12-1.54.37-2.23.25-.69.6-1.28 1.07-1.78.47-.5 1.03-.89 1.68-1.17.65-.28 1.36-.42 2.15-.42.88 0 1.65.17 2.31.51.66.34 1.2.8 1.63 1.39.43.59.74 1.27.93 2.04.19.77.26 1.58.21 2.43h-7.69c0 .84.28 1.64.72 2.07v-.01zM3.496 8.96h2.86c.695 0 1.24-.166 1.636-.5.396-.334.595-.84.595-1.52 0-.67-.195-1.14-.585-1.42-.39-.28-.955-.42-1.695-.42H3.496V8.96zm13.17-2.028c-.574 0-1.05.107-1.428.32-.377.215-.675.47-.892.77-.217.3-.37.63-.456.99-.085.36-.13.71-.13 1.05h5.44c-.07-.94-.39-1.65-.96-2.13-.57-.48-1.28-.72-1.57-.72l-.004-.28zM3.496 14.97h3.24c.8 0 1.43-.2 1.9-.6.47-.4.71-.985.71-1.76 0-.78-.24-1.36-.72-1.74-.48-.38-1.11-.57-1.9-.57H3.496v4.67z"/>
                          </svg>
                          <span className="text-sm whitespace-nowrap">Behance</span>
                        </motion.a>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-purple-500/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-50" />
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 }} className="space-y-8">
            <div className="space-y-6">
              {bioText?.split("\n\n").map((paragraph: string, i: number) => (
                <TextReveal key={i} as="p" className="text-text-secondary text-lg leading-relaxed" delay={i * 0.2}>
                  {paragraph}
                </TextReveal>
              ))}
            </div>

            {showStats && (
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6, duration: 0.8 }} className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
                {statsData.map((stat: any, i: number) => (
                  <div key={i} className="text-center group">
                    <span className="font-heading text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-purple-500 inline-block drop-shadow-sm">
                      <AnimatedCounter text={stat.number} />
                    </span>
                    <p className="text-text-secondary font-medium text-sm mt-2 transition-colors duration-300 group-hover:text-text-primary">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}