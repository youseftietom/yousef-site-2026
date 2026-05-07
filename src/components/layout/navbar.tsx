"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl"; // التعديل 1: استيراد useLocale
import { Menu, X } from "lucide-react";
import ThemeToggle from "@/components/ui/theme-toggle";
import LanguageToggle from "@/components/ui/language-toggle";

const navLinks = [
  { key: "home", href: "#hero" },
  { key: "projects", href: "#projects" },
  { key: "about", href: "#about" },
  { key: "experience", href: "#experience" },
  { key: "contact", href: "#contact" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale(); // التعديل 2: تعريف locale
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [hasLoaded, setHasLoaded] = useState(false); 

  useEffect(() => {
    // الناف بار هيستنى الاسبلاش وبعدين ينزل
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 2800); 

    const handleScroll = () => {
      // بنعرف بس لو العميل نزل سكرول عشان ندي للناف بار خلفية شفافة
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // التعديل 3: تطوير دالة scrollTo عشان تشتغل في كل الصفحات
  const scrollTo = (href: string) => {
    setIsMenuOpen(false);
    
    // بندور على السكشن في الصفحة الحالية
    const el = document.querySelector(href);
    
    if (el) {
      // لو إحنا في الصفحة الرئيسية والسكشن موجود، انزل بنعومة
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // لو إحنا جوه صفحة مشروع والسكشن مش موجود، ارجع للرئيسية وبعدين روح للسكشن
      window.location.href = `/${locale}${href}`;
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ 
          y: !hasLoaded ? -100 : 0,
          opacity: !hasLoaded ? 0 : 1 
        }}
        transition={{ 
          duration: 0.6, 
          ease: [0.16, 1, 0.3, 1],
          type: "spring", stiffness: 100, damping: 20
        }}
        className={`fixed top-0 inset-x-0 z-[100] transition-all duration-500 ${
          isScrolled ? "py-3" : "py-5"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-6">
          <div
            className={`flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500 ${
              isScrolled ? "glass-strong border border-white/5 dark:border-white/10 shadow-2xl shadow-black/10" : ""
            }`}
          >
            {/* Logo Image */}
            <motion.a
              href="#hero"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 overflow-hidden"
              onClick={(e) => { 
                e.preventDefault(); 
                scrollTo("#hero"); 
              }}
            >
              {/* اللوجو بتاع اللايت مود (بيختفي في الدارك) */}
              <Image
                src="/logo-light.png" 
                alt="Logo Light"
                fill
                className="object-contain dark:hidden"
                priority
              />
              
              {/* اللوجو بتاع الدارك مود (مخفي، وبيظهر بس في الدارك) */}
              <Image
                src="/logo-dark.png" 
                alt="Logo Dark"
                fill
                className="object-contain hidden dark:block"
                priority
              />
            </motion.a>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => scrollTo(link.href)}
                  className="relative group px-4 py-2 text-sm text-text-secondary hover:text-text-primary transition-colors rounded-xl hover:bg-surface-hover font-medium overflow-hidden"
                >
                  <span className="relative z-10">{t(link.key)}</span>
                  <span className="absolute bottom-1.5 left-1/2 w-0 h-[2px] bg-primary -translate-x-1/2 transition-all duration-300 group-hover:w-1/2 rounded-full opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />

              {/* Mobile Menu Button */}
              <motion.button
                className="md:hidden w-10 h-10 rounded-full glass flex items-center justify-center text-text-primary border border-white/10"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.9 }}
                aria-label={isMenuOpen ? t("close") : t("menu")}
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <X size={18} strokeWidth={2.5} />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                      <Menu size={18} strokeWidth={2.5} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-[99] bg-background/90 flex items-center justify-center"
          >
            <motion.nav className="flex flex-col items-center gap-6">
              {navLinks.map((link, i) => (
                <div key={link.key} className="overflow-hidden">
                  <motion.button
                    initial={{ opacity: 0, y: 50, rotateX: -20 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: 30, rotateX: 20 }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => scrollTo(link.href)}
                    className="text-4xl font-heading font-black text-text-primary hover:text-primary transition-colors tracking-tight"
                  >
                    {t(link.key)}
                  </motion.button>
                </div>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}