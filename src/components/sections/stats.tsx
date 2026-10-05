"use client";

import React, { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { useLocale } from "next-intl";
import TextReveal from "@/components/animations/text-reveal";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ text }: { text: string }) {
  if (!text) return <span>0</span>;

  const safeText = String(text);
  // Detect prefix symbols like "+" or "$" before the number
  const prefixMatch = safeText.match(/^([^0-9]*)(\d+)(.*)$/);

  if (!prefixMatch) return <span>{safeText}</span>;

  const prefix = prefixMatch[1] || "";
  const num = parseInt(prefixMatch[2], 10);
  const suffix = prefixMatch[3] || "";

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (inView) {
      animate(count, num, { duration: 2.2, ease: "easeOut" });
    }
  }, [count, inView, num]);

  return (
    <span ref={ref} className="inline-flex items-center justify-center tabular-nums">
      <span>{prefix}</span>
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

// ─── Fallback Data ────────────────────────────────────────────────────────────
const FALLBACK_STATS = [
  { value: "+50", label_en: "Projects Completed", label_ar: "مشروع منجز" },
  { value: "3+", label_en: "Years of Experience", label_ar: "سنوات خبرة" },
  { value: "30+", label_en: "Happy Clients", label_ar: "عميل سعيد" },
  { value: "100%", label_en: "Satisfaction Rate", label_ar: "نسبة الرضا" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface StatItem {
  value?: string;
  label_en?: string;
  label_ar?: string;
}

interface StatsData {
  heading_en?: string;
  heading_ar?: string;
  subtitle_en?: string;
  subtitle_ar?: string;
  statsList?: StatItem[];
}

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function Stats({ data }: { data?: StatsData }) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const heading =
    (isRtl ? data?.heading_ar : data?.heading_en) ||
    (isRtl ? "أرقام تتحدث عن نفسها" : "Numbers That Speak");

  const subtitle =
    (isRtl ? data?.subtitle_ar : data?.subtitle_en) ||
    (isRtl
      ? "محطات وإنجازات على مدار رحلتي الإبداعية"
      : "Milestones & achievements across my creative journey");

  const stats: StatItem[] =
    data?.statsList && data.statsList.length > 0
      ? data.statsList
      : FALLBACK_STATS;

  return (
    <section
      id="stats"
      className="relative w-full py-24 md:py-32 overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
      aria-label={heading}
    >
      {/* Background decoration */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
      >
        {/* Subtle radial gradient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[var(--color-primary,theme(colors.violet.500))]/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-[var(--color-primary,theme(colors.violet.500))] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3"
          >
            {subtitle}
          </motion.p>

          <TextReveal as="h2" className="font-heading text-4xl md:text-6xl font-bold text-text-primary justify-center">
            {heading}
          </TextReveal>

          {/* Decorative line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mt-5 h-px w-24 origin-center bg-gradient-to-r from-transparent via-[var(--color-primary,theme(colors.violet.500))] to-transparent"
          />
        </div>

        {/* ── Stats Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[var(--color-border,theme(colors.slate.200))] dark:bg-white/10 rounded-2xl overflow-hidden shadow-sm"
        >
          {stats.map((stat, index) => {
            const label = isRtl ? stat.label_ar : stat.label_en;
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                className="group relative flex flex-col items-center justify-center gap-2 px-6 py-10 md:py-14 bg-[var(--color-bg,white)] dark:bg-[var(--color-surface,theme(colors.slate.900))] text-center hover:bg-[var(--color-primary,theme(colors.violet.500))]/5 dark:hover:bg-[var(--color-primary,theme(colors.violet.500))]/10 transition-colors duration-300"
              >
                {/* Subtle gradient accent on hover */}
                <div
                  aria-hidden
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at 50% 50%, rgba(var(--primary-rgb, 124 58 237) / 0.08) 0%, transparent 70%)",
                  }}
                />

                {/* Number */}
                <span className="relative z-10 text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[var(--color-primary,theme(colors.violet.500))] leading-none">
                  <AnimatedCounter text={stat.value || "0"} />
                </span>

                {/* Divider */}
                <span
                  aria-hidden
                  className="block h-px w-8 bg-[var(--color-primary,theme(colors.violet.500))]/25 group-hover:w-14 group-hover:bg-[var(--color-primary,theme(colors.violet.500))]/60 transition-all duration-500"
                />

                {/* Label */}
                <p className="relative z-10 text-sm md:text-base font-medium text-[var(--color-text-secondary,theme(colors.slate.500))] dark:text-slate-400 leading-snug max-w-[10rem]">
                  {label || (isRtl ? "إنجاز" : "Achievement")}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
