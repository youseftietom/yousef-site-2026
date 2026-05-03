"use client";

import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import MagneticButton from "@/components/animations/magnetic-button";

export default function Footer({ socials = [] }: { socials?: any[] }) {
  const t = useTranslations("footer");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-black/[0.08] dark:border-white/[0.1] mt-20">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* استخدمنا Grid هنا لضمان السنتر والتعادل بين الأطراف */}
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-10 w-full">
          
          {/* 1. الجانب الأيسر (أو الأيمن حسب اللغة): الحقوق */}
          <div className="flex justify-center md:justify-start order-2 md:order-1">
            <div className="text-zinc-600 dark:text-zinc-400 text-[13px] font-bold tracking-tight whitespace-nowrap">
              © {year} — {t("copyright", { year: "" }).replace("{year}", "")}
            </div>
          </div>

          {/* 2. المنتصف: الأيقونات (سنتر بالملي) */}
          <div className="flex justify-center items-center gap-3 order-1 md:order-2">
            {socials.map((social, index) => {
              const iconUrl = social?.iconImage?.asset?.url;

              return (
                <motion.a
                  key={social._key || index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-11 h-11 flex items-center justify-center rounded-full 
                             bg-zinc-200/50 dark:bg-white/[0.07] 
                             border border-black/10 dark:border-white/10
                             transition-colors duration-150 hover:bg-primary"
                  whileHover={{ y: -6, scale: 1.15 }}
                  whileTap={{ scale: 0.85 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 1000, 
                    damping: 15, 
                    mass: 0.5 
                  }}
                >
                  <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 blur-md 
                                  bg-primary/40 transition-opacity duration-150" />

                  {iconUrl ? (
                    <img 
                      src={iconUrl} 
                      alt={social.platform} 
                      className="w-5 h-5 z-10 opacity-100 brightness-110 contrast-125 
                                 filter group-hover:brightness-200 
                                 transition-all duration-150"
                    />
                  ) : (
                    <span className="text-[10px] font-black z-10 text-black dark:text-white group-hover:text-white">
                      {social.platform?.substring(0, 2)}
                    </span>
                  )}

                  <div className="absolute -bottom-1.5 w-1/2 h-1 rounded-full 
                                  bg-black/10 dark:bg-primary/50 
                                  blur-sm opacity-0 group-hover:opacity-100 transition-all duration-150" />
                </motion.a>
              );
            })}
          </div>

          {/* 3. الجانب الأيمن (أو الأيسر حسب اللغة): زر العودة للأعلى */}
          <div className="flex justify-center md:justify-end order-3">
            <MagneticButton as="button" onClick={scrollToTop} className="flex items-center gap-3 group">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 group-hover:text-primary transition-colors whitespace-nowrap">
                {t("backToTop")}
              </span>
              <motion.div
                className="w-10 h-10 rounded-full border-2 border-black/10 dark:border-white/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary transition-all"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 800, damping: 15 }}
              >
                <ArrowUp size={16} strokeWidth={3} className="text-zinc-600 dark:text-zinc-400 group-hover:text-white transition-colors" />
              </motion.div>
            </MagneticButton>
          </div>

        </div>
      </div>
    </footer>
  );
}