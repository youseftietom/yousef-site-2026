"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl"; 
import { Menu, X, ArrowUpRight, ArrowUpLeft } from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";
import LanguageToggle from "@/components/ui/language-toggle";

interface NavLink {
  title_en: string;
  title_ar: string;
  href: string;
}

export default function Navbar({ navLinks = [], settings }: { navLinks?: NavLink[], settings?: any }) {
  const locale = useLocale(); 
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false); 
  const [activeSection, setActiveSection] = useState<string>("");
  const headerRef = useRef<HTMLElement | null>(null);

  const defaultLinks = [
    { title_en: "Home", title_ar: "الرئيسية", href: "#hero" },
    { title_en: "Projects", title_ar: "أعمالي", href: "#projects" },
    { title_en: "About", title_ar: "من أنا", href: "#about" },
    { title_en: "Experience", title_ar: "خبراتي", href: "#experience" },
    { title_en: "Contact", title_ar: "تواصل معي", href: "#contact" },
  ];

  const finalLinks = navLinks && navLinks.length > 0 ? navLinks : defaultLinks;
  // مفتاح ثابت (string) بيمثل الأقسام الحالية — لو زودت أو حذفت أقسام، القيمة دي بتتغير
  // فيعيد الـ effect بتاع تتبع القسم النشط ربط نفسه على الأقسام الجديدة تلقائيًا
  const sectionHrefsKey = finalLinks.map((link) => link.href).join("|");

  const logoType = settings?.logoType || "image"; 
  const logoText = settings?.logoText || "Youssef."; 
  
  const logoLightUrl_en = settings?.logoImageLight_en?.asset?.url || "/logo-light.png"; 
  const logoDarkUrl_en = settings?.logoImageDark_en?.asset?.url || "/logo-dark.png"; 
  const logoLightUrl_ar = settings?.logoImageLight_ar?.asset?.url || "/logo-light.png"; 
  const logoDarkUrl_ar = settings?.logoImageDark_ar?.asset?.url || "/logo-dark.png"; 

  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 2800); 
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // تتبع القسم النشط بدقة: بنحدد أي قسم بيقطعه "خط" أسفل الـ navbar فعليًا دلوقتي
  // (ارتفاع الـ navbar بيتقاس لحظيًا مش رقم ثابت، عشان يفضل دقيق حتى لو تصميم الهيدر اتغير)
  // وده شغال دايمًا (مش بس والقايمة مفتوحة) ومش بيهم لو زودت/حذفت أقسام لاحقًا
  useEffect(() => {
    const sectionHrefs = sectionHrefsKey.split("|").filter(Boolean);
    if (sectionHrefs.length === 0) return;

    const updateActiveSection = () => {
      const headerLine = (headerRef.current?.offsetHeight ?? 90) + 4;
      let current = "";

      // 1) الأدق: القسم اللي "خط الهيدر" فعليًا واقع جواه (top <= الخط < bottom)
      for (const href of sectionHrefs) {
        const el = document.querySelector(href) as HTMLElement | null;
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= headerLine && rect.bottom > headerLine) {
          current = href;
          break;
        }
      }

      // 2) احتياطي: لو فيه فراغ بين الأقسام ومفيش تطابق مباشر،
      //    خُد آخر قسم يكون "top" بتاعه فات خط الهيدر
      if (!current) {
        for (const href of sectionHrefs) {
          const el = document.querySelector(href) as HTMLElement | null;
          if (el && el.getBoundingClientRect().top <= headerLine) {
            current = href;
          }
        }
      }

      // 3) لسه من غير نتيجة (يعني لسه فوق كل الأقسام) → أول قسم
      if (!current) current = sectionHrefs[0];

      // 4) لو وصلنا لآخر الصفحة، خلي آخر قسم هو النشط
      //    (بيحل مشكلة قسم أخير قصير مبيوصلوش خط الهيدر أبدًا)
      const reachedBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      if (reachedBottom) current = sectionHrefs[sectionHrefs.length - 1];

      setActiveSection((prev) => (prev === current ? prev : current));
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection);

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [sectionHrefsKey]);

  // امنع سكرول الصفحة اللي وراها لما منيو الموبايل مفتوحة
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const scrollTo = (href: string) => {
    setIsMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.href = `/${locale}${href}`;
    }
  };

  const ArrowIcon = locale === "ar" ? ArrowUpLeft : ArrowUpRight;

  return (
    <motion.header
      ref={headerRef}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: !hasLoaded ? -100 : 0, opacity: !hasLoaded ? 0 : 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${isScrolled ? "py-3" : "py-5"}`}
    >
      <nav className="mx-auto max-w-7xl px-4 md:px-6 relative">
        <div className={`flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all duration-500 ${isScrolled ? "glass-strong border border-white/5 dark:border-white/10 shadow-2xl shadow-black/10" : ""}`}>
          
          <motion.a href="#hero" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative flex items-center justify-start cursor-pointer" onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }}>
            {logoType === "text" ? (
              <span className="text-xl md:text-2xl font-black tracking-tighter text-text-primary whitespace-nowrap py-1">
                {logoText}
              </span>
            ) : (
              <div className="flex items-center">
                {locale === "ar" ? (
                  <>
                    <img src={logoLightUrl_ar} alt="Logo Arabic Light" className="h-6 md:h-8 w-auto object-contain dark:hidden" />
                    <img src={logoDarkUrl_ar} alt="Logo Arabic Dark" className="h-6 md:h-8 w-auto object-contain hidden dark:block" />
                  </>
                ) : (
                  <>
                    <img src={logoLightUrl_en} alt="Logo English Light" className="h-6 md:h-8 w-auto object-contain dark:hidden" />
                    <img src={logoDarkUrl_en} alt="Logo English Dark" className="h-6 md:h-8 w-auto object-contain hidden dark:block" />
                  </>
                )}
              </div>
            )}
          </motion.a>

          <div className="hidden md:flex items-center gap-1">
            {finalLinks.map((link, index) => {
              const isActive = activeSection === link.href;
              return (
                <button
                  key={index}
                  onClick={() => scrollTo(link.href)}
                  className={`relative group px-4 py-2 text-sm transition-colors rounded-xl hover:bg-surface-hover font-medium overflow-hidden ${
                    isActive ? "text-text-primary" : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span className="relative z-10">{locale === "ar" ? link.title_ar : link.title_en}</span>
                  {isActive ? (
                    <motion.span
                      layoutId="desktop-active-underline"
                      className="absolute bottom-1.5 left-1/2 w-1/2 h-[2px] bg-primary -translate-x-1/2 rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  ) : (
                    <span className="absolute bottom-1.5 left-1/2 w-0 h-[2px] bg-primary -translate-x-1/2 transition-all duration-300 group-hover:w-1/2 rounded-full opacity-0 group-hover:opacity-100" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />

            <motion.button className="md:hidden relative z-[100] w-10 h-10 rounded-full glass flex items-center justify-center text-text-primary border border-white/10" onClick={() => setIsMenuOpen(!isMenuOpen)} whileTap={{ scale: 0.9 }}>
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={18} strokeWidth={2.5} /></motion.div>
                ) : (
                  <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={18} strokeWidth={2.5} /></motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* 🔴 الموبايل منيو */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top right" }}
              className="absolute top-full mt-4 end-4 w-[280px] rounded-[1.5rem] p-[1.5px] overflow-hidden shadow-[0_10px_40px_rgba(168,85,247,0.25)] z-[9999] md:hidden"
            >
              
              {/* 🐍 تأثير الثعبان البنفسجي — CSS animation عادي، أخف على الموبايل */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] z-0 animate-spin-slow"
                style={{
                  background: "conic-gradient(from 0deg, transparent 60%, rgba(168, 85, 247, 0.2) 80%, rgba(168, 85, 247, 1) 100%)",
                }}
              />

              {/* 🧊 البوكس الداخلي (الإزاز) */}
              <div className="relative z-10 w-full bg-background/90 dark:bg-[#0a0a0a]/85 backdrop-blur-md rounded-[calc(1.5rem-1.5px)] shadow-inner max-h-[70vh] overflow-y-auto">

                {/* عنوان تحريري صغير أعلى القايمة — لمسة "استوديو" احترافية */}
                <div className="px-5 pt-4 pb-2">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                    {locale === "ar" ? "التنقل" : "Navigation"}
                  </span>
                </div>

                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                    }
                  }}
                  className="flex flex-col pb-1.5"
                >
                  {finalLinks.map((link, i) => {
                    const isActive = activeSection === link.href;
                    return (
                      <motion.button
                        key={i}
                        variants={{
                          hidden: { opacity: 0, x: locale === "ar" ? 15 : -15 },
                          visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }
                        }}
                        onClick={() => scrollTo(link.href)}
                        className={`group relative w-full flex items-center justify-between gap-3 px-5 py-4 transition-colors duration-300 ${
                          i !== finalLinks.length - 1 ? "border-b border-border-subtle/70 dark:border-white/[0.06]" : ""
                        } hover:bg-black/[0.04] dark:hover:bg-white/[0.04]`}
                      >
                        {/* شرطة بنفسجية على حافة القسم النشط بس */}
                        {isActive && (
                          <motion.span
                            layoutId="mobile-active-indicator"
                            className="absolute start-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-full"
                            transition={{ type: "spring", stiffness: 500, damping: 35 }}
                          />
                        )}

                        <span
                          className={`text-[15px] tracking-tight transition-colors duration-300 ${
                            isActive ? "text-text-primary font-semibold" : "text-text-secondary font-medium group-hover:text-text-primary"
                          }`}
                        >
                          {locale === "ar" ? link.title_ar : link.title_en}
                        </span>

                        <ArrowIcon
                          size={14}
                          className={`shrink-0 transition-all duration-300 ${
                            isActive
                              ? "opacity-100 translate-x-0 text-primary"
                              : `opacity-0 text-text-muted group-hover:opacity-100 group-hover:text-primary ${locale === "ar" ? "translate-x-1 group-hover:translate-x-0" : "-translate-x-1 group-hover:translate-x-0"}`
                          }`}
                        />
                      </motion.button>
                    );
                  })}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>
    </motion.header>
  );
}