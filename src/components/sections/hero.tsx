"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Sparkles, MousePointer2 } from "lucide-react";
import MagneticButton from "@/components/animations/magnetic-button";

export default function Hero({ data }: { data?: any }) {
  const t = useTranslations("hero");
  const locale = useLocale();
  const isRtl = locale === "ar"; 
  const [isMobile, setIsMobile] = useState(false);
  const [startAnimations, setStartAnimations] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); 

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimations(true);
    }, 4000); 
    return () => clearTimeout(timer);
  }, []);

  const greeting = (isRtl ? data?.greeting_ar : data?.greeting_en) || t("greeting");
  const name = (isRtl ? data?.name_ar : data?.name) || t("name");
  const subtitle = (isRtl ? data?.subtitle_ar : data?.subtitle_en) || t("subtitle");
  const cta = (isRtl ? data?.ctaText_ar : data?.ctaText_en) || t("cta");
  const ctaLink = data?.ctaLink || "#projects";
  const contactText = isRtl ? "تواصل معي" : "Let's Talk";
  const showScrollHint = data?.showScrollHint ?? true;

  const scrollToSection = (targetId: string) => {
    const el = document.querySelector(targetId);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-transparent pt-16 md:pt-24 pb-12"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marching-ants {
          to { stroke-dashoffset: 12; }
        }
        .ants-line {
          animation: marching-ants 0.6s linear infinite;
        }
      `}} />

      <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 text-center flex flex-col items-center justify-center flex-grow">
        <AnimatePresence>
          {startAnimations && (
            <>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
                className="text-text-secondary text-xs sm:text-sm md:text-base mb-2 sm:mb-4 font-medium tracking-wide opacity-80"
              >
                {greeting}
              </motion.p>

              <div className="relative inline-flex items-center justify-center py-2 sm:py-4 px-4 sm:px-6 my-2 sm:my-3 z-20">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className={`font-heading font-bold text-text-primary text-center whitespace-nowrap relative z-20 ${
                    isRtl 
                      ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-normal" 
                      : "text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tighter"
                  }`}
                >
                  {name}
                </motion.h1>

                {/* Selection Box */}
                <div className="absolute inset-0 z-30 pointer-events-none" style={{ margin: "-10px" }}>
                  <motion.div
                    initial={{ width: 0, height: 0, opacity: 0 }}
                    animate={{ 
                      width: isScrolled ? 0 : "100%", 
                      height: isScrolled ? 0 : "100%", 
                      opacity: isScrolled ? 0 : 1 
                    }}
                    transition={{ 
                      duration: isScrolled ? 0.6 : 1.0, 
                      delay: isScrolled ? 0 : 0.3, 
                      ease: isScrolled ? "easeInOut" : [0.34, 1.2, 0.64, 1] 
                    }}
                    className="absolute top-0 left-0"
                  >
                    {/* 🔴 التعديل هنا: شيلنا أي شفافية عشان الخط يبقى لون صريح جداً */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      <rect
                        x="0" y="0" width="100%" height="100%"
                        fill="none"
                        strokeWidth="1.5"
                        strokeDasharray="6 6"
                        className="stroke-black dark:stroke-white ants-line"
                      />
                    </svg>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isScrolled ? 0 : 1 }}
                      transition={{ duration: 0.2, delay: isScrolled ? 0 : 0.8 }}
                    >
                      <div className="absolute top-[-4px] left-[-4px] w-1.5 h-1.5 sm:w-2 sm:h-2 border border-black dark:border-white bg-background" />
                      <div className="absolute top-[-4px] right-[-4px] w-1.5 h-1.5 sm:w-2 sm:h-2 border border-black dark:border-white bg-background" />
                      <div className="absolute bottom-[-4px] left-[-4px] w-1.5 h-1.5 sm:w-2 sm:h-2 border border-black dark:border-white bg-background" />
                      <div className="absolute bottom-[-4px] right-[-4px] w-1.5 h-1.5 sm:w-2 sm:h-2 border border-black dark:border-white bg-background" />
                    </motion.div>
                  </motion.div>

                  <motion.div
                    initial={{ top: 0, left: 0, opacity: 0 }}
                    animate={{ 
                      top: isScrolled ? 0 : "100%", 
                      left: isScrolled ? 0 : "100%", 
                      opacity: isScrolled ? 0 : 1 
                    }}
                    transition={{ 
                      duration: isScrolled ? 0.6 : 1.0, 
                      delay: isScrolled ? 0 : 0.3, 
                      ease: isScrolled ? "easeInOut" : [0.34, 1.2, 0.64, 1] 
                    }}
                    className={`absolute -mt-1 ${isRtl ? '-mr-1' : '-ml-1'} text-black dark:text-white`}
                  >
                    <MousePointer2 size={isMobile ? 20 : 32} className={`fill-transparent stroke-black dark:stroke-white stroke-[1.5] ${isRtl ? 'scale-x-[-1]' : ''}`} />
                  </motion.div>
                </div>
              </div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-text-secondary text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-8 sm:mb-10 md:mb-12 leading-relaxed font-medium opacity-60 tracking-normal mt-3 sm:mt-5 px-2"
              >
                {subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 relative z-40 w-full sm:w-auto px-4 sm:px-0 max-w-xs sm:max-w-none mx-auto"
              >
                <MagneticButton
                  as="button"
                  onClick={() => scrollToSection(ctaLink)}
                  className="btn-primary text-sm md:text-base px-6 py-2.5 md:px-8 md:py-3 w-full sm:w-auto rounded-full font-bold shadow-lg backdrop-blur-sm flex items-center justify-center gap-2"
                  data-cursor="view"
                  strength={0.15}
                >
                  <Sparkles size={isMobile ? 14 : 16} />
                  <span>{cta}</span>
                </MagneticButton>

                <MagneticButton
                  as="button"
                  onClick={() => scrollToSection("#contact")}
                  className="group relative flex items-center justify-center gap-2 px-6 py-2.5 md:px-8 md:py-3 w-full sm:w-auto rounded-full border border-border/40 bg-surface/10 hover:bg-surface/30 text-text-primary backdrop-blur-sm transition-all duration-300 text-sm md:text-base font-bold"
                  data-cursor="view"
                  strength={0.12}
                >
                  <Mail size={isMobile ? 14 : 16} className="text-primary group-hover:scale-110 transition-transform" />
                  <span>{contactText}</span>
                </MagneticButton>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {showScrollHint && startAnimations && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isScrolled ? 0 : 1 }} 
            transition={{ duration: 0.4 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-3 cursor-pointer hidden md:flex z-20"
            onClick={() => scrollToSection(ctaLink)}
          >
            <span className="text-text-muted text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">
              {t("scrollHint") || (isRtl ? "اسحب لأسفل" : "Scroll to explore")}
            </span>
            <div className="relative w-[26px] h-[42px] rounded-full border border-text-muted/10 flex justify-center p-1.5 bg-background/10 backdrop-blur-[1px]">
              <motion.div
                animate={{ y: [0, 12, 0], opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-1 h-1.5 bg-primary rounded-full"
              />
            </div>
            <div className="w-[1px] h-12 bg-gradient-to-b from-primary/20 to-transparent" />
          </motion.div>
        </AnimatePresence>
      )}
    </section>
  );
}