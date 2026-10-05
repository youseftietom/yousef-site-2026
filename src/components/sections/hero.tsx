"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Sparkles, ArrowRight, ArrowLeft, MousePointer2 } from "lucide-react";
import MagneticButton from "@/components/animations/magnetic-button";

export default function HeroPro({ data }: { data?: any }) {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRtl = locale === "ar";
  
  const [isMobile, setIsMobile] = useState(false);
  const [startAnimations, setStartAnimations] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setStartAnimations(true), 3000); 
    return () => clearTimeout(timer);
  }, []);

  const greeting = (isRtl ? data?.greeting_ar : data?.greeting_en) || t("greeting");
  const name = (isRtl ? data?.name_ar : data?.name) || t("name");
  const subtitle = (isRtl ? data?.subtitle_ar : data?.subtitle_en) || t("subtitle");
  const cta = (isRtl ? data?.ctaText_ar : data?.ctaText_en) || t("cta");
  const ctaLink = data?.ctaLink || "#projects";
  const contactText = isRtl ? "تواصل معي" : "Let's Talk";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const scrollToSection = (targetId: string) => {
    const el = document.querySelector(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-transparent pt-24 pb-12"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes marching-ants {
          to { stroke-dashoffset: 12; }
        }
        .ants-line {
          animation: marching-ants 0.6s linear infinite;
        }
      `,
        }}
      />

      {/* 1. تأثير الخلفية الشبكي (Grid & Glow) الشفاف مع الفيد (Fade) */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {/* تم إضافة الـ Mask هنا لعمل Fade للخلفية الشبكية من فوق وتحت */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
          }}
        ></div>
        
        {/* التوهج تم ضبطه ليكون في المنتصف */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/20 blur-[120px] rounded-full opacity-50"></div>
      </div>

      <div className="relative z-20 mx-auto max-w-5xl w-full px-4 sm:px-6 text-center flex flex-col items-center justify-center flex-grow">
        
        {/* 2. شارة الحالة (Availability Badge) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/50 border border-border/50 text-xs sm:text-sm font-medium text-text-secondary shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            {isRtl ? "متاح للعمل على مشاريع جديدة" : "Available for new projects"}
          </div>
        </motion.div>

        {/* 3. الترحيب */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-primary font-semibold tracking-wide text-sm md:text-base mb-2"
        >
          {greeting}
        </motion.p>

        {/* 4. حاوية الاسم + حركة المربع والسهم */}
        <div className="relative inline-flex items-center justify-center py-4 sm:py-6 px-6 sm:px-10 my-2">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className={`relative z-20 font-bold text-center max-w-[85vw] break-words ${
              isRtl
                ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight"
                : "text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight tracking-tight"
            }`}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-primary to-text-secondary/70">
              {name}
            </span>
          </motion.h1>

          <AnimatePresence>
            {startAnimations && (
              <div className="absolute inset-0 z-30 pointer-events-none">
                <motion.div
                  initial={{ width: 0, height: 0, opacity: 0 }}
                  animate={{
                    width: isScrolled ? 0 : "100%",
                    height: isScrolled ? 0 : "100%",
                    opacity: isScrolled ? 0 : 1,
                  }}
                  transition={{
                    duration: isScrolled ? 0.5 : 0.9,
                    delay: isScrolled ? 0 : 0.2,
                    ease: isScrolled ? "easeInOut" : [0.34, 1.1, 0.64, 1],
                  }}
                  className="absolute top-0 left-0 overflow-visible"
                >
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                    <rect
                      x="0.75"
                      y="0.75"
                      width="calc(100% - 1.5px)"
                      height="calc(100% - 1.5px)"
                      fill="none"
                      strokeWidth="1.5"
                      strokeDasharray="6 6"
                      className="stroke-black/70 dark:stroke-white/70 ants-line"
                    />
                  </svg>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isScrolled ? 0 : 1 }}
                    transition={{ duration: 0.2, delay: isScrolled ? 0 : 0.9 }}
                  >
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 -translate-x-1/2 -translate-y-1/2 border border-black dark:border-white bg-background" />
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 translate-x-1/2 -translate-y-1/2 border border-black dark:border-white bg-background" />
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 sm:w-2 sm:h-2 -translate-x-1/2 translate-y-1/2 border border-black dark:border-white bg-background" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 sm:w-2 sm:h-2 translate-x-1/2 translate-y-1/2 border border-black dark:border-white bg-background" />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ top: 0, left: 0, opacity: 0 }}
                  animate={{
                    top: isScrolled ? 0 : "100%",
                    left: isScrolled ? 0 : "100%",
                    opacity: isScrolled ? 0 : 1,
                  }}
                  transition={{
                    duration: isScrolled ? 0.5 : 0.9,
                    delay: isScrolled ? 0 : 0.2,
                    ease: isScrolled ? "easeInOut" : [0.34, 1.1, 0.64, 1],
                  }}
                  className="absolute text-black dark:text-white"
                >
                  <MousePointer2
                    size={isMobile ? 18 : 26}
                    className="fill-background stroke-black dark:stroke-white stroke-[1.5]"
                  />
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* 5. الوصف */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-text-secondary text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed mt-4"
        >
          {subtitle}
        </motion.p>

        {/* 6. الأزرار */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          <MagneticButton
            as="button"
            onClick={() => scrollToSection(ctaLink)}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-full font-semibold transition-all shadow-[0_0_40px_-10px_rgba(var(--primary),0.5)]"
            strength={0.2}
          >
            <Sparkles size={16} />
            <span>{cta}</span>
            <ArrowIcon size={18} className="group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </MagneticButton>

          <MagneticButton
            as="button"
            onClick={() => scrollToSection("#contact")}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-surface/50 hover:bg-surface/80 border border-border/50 text-text-primary px-8 py-3.5 rounded-full font-semibold transition-all backdrop-blur-sm"
            strength={0.15}
          >
            <Mail size={18} className="text-text-secondary group-hover:text-primary transition-colors" />
            <span>{contactText}</span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}