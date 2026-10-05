"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import {
  Zap,
  Target,
  Gem,
  Flame,
  Trophy,
  MessageCircle,
  Palette,
  RefreshCw,
  Shield,
  BarChart2,
  Sparkles,
  Handshake,
  Smartphone,
  Monitor,
  Film,
  Clock,
  LucideIcon,
} from "lucide-react";
import TextReveal from "@/components/animations/text-reveal";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ─── Icon Map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  zap: Zap,
  target: Target,
  gem: Gem,
  flame: Flame,
  trophy: Trophy,
  "message-circle": MessageCircle,
  palette: Palette,
  "refresh-cw": RefreshCw,
  shield: Shield,
  "bar-chart": BarChart2,
  sparkles: Sparkles,
  handshake: Handshake,
  smartphone: Smartphone,
  monitor: Monitor,
  film: Film,
  clock: Clock,
};

// ─── Fallback Data ────────────────────────────────────────────────────────────
const FALLBACK_FEATURES = [
  {
    icon: "zap",
    title_en: "Fast Delivery",
    title_ar: "تسليم سريع",
    description_en:
      "I respect your timeline. Every project is delivered on time without compromising quality.",
    description_ar:
      "أحترم جدولك الزمني. كل مشروع يُسلَّم في الموعد دون المساس بالجودة.",
  },
  {
    icon: "gem",
    title_en: "Premium Quality",
    title_ar: "جودة استثنائية",
    description_en:
      "Each deliverable goes through a rigorous quality check to ensure pixel-perfect results.",
    description_ar:
      "كل تسليم يمر بمراجعة دقيقة لضمان نتائج احترافية تليق بعلامتك التجارية.",
  },
  {
    icon: "message-circle",
    title_en: "Clear Communication",
    title_ar: "تواصل واضح",
    description_en:
      "You're always in the loop. I keep communication transparent and responsive throughout.",
    description_ar:
      "أنت دائماً على علم بكل شيء. تواصل شفاف وسريع في كل مراحل المشروع.",
  },
  {
    icon: "refresh-cw",
    title_en: "Flexible Revisions",
    title_ar: "مراجعات مرنة",
    description_en:
      "Your satisfaction is the goal. I offer revisions until the result truly matches your vision.",
    description_ar:
      "رضاك هو الهدف. أقدم مراجعات حتى تصل النتيجة بالضبط لما تتخيله.",
  },
  {
    icon: "target",
    title_en: "Strategic Thinking",
    title_ar: "تفكير استراتيجي",
    description_en:
      "I don't just create — I think about impact. Every design decision is intentional.",
    description_ar:
      "لا أصمم فحسب، بل أفكر في التأثير. كل قرار تصميمي له هدف واضح.",
  },
  {
    icon: "sparkles",
    title_en: "Attention to Detail",
    title_ar: "اهتمام بالتفاصيل",
    description_en:
      "The difference between good and great is in the details — and I obsess over both.",
    description_ar:
      "الفرق بين الجيد والرائع يكمن في التفاصيل — وأنا أهتم بكل صغيرة وكبيرة.",
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface FeatureItem {
  icon?: string;
  title_en?: string;
  title_ar?: string;
  description_en?: string;
  description_ar?: string;
}

interface WhyChooseMeData {
  heading_en?: string;
  heading_ar?: string;
  subtitle_en?: string;
  subtitle_ar?: string;
  featuresList?: FeatureItem[];
}

// ─── Animation Variants ───────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55 },
  },
};

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({
  feature,
  isRtl,
  index,
}: {
  feature: FeatureItem;
  isRtl: boolean;
  index: number;
}) {
  const IconComponent =
    (feature.icon && ICON_MAP[feature.icon]) || Gem;

  const title = isRtl ? feature.title_ar : feature.title_en;
  const description = isRtl ? feature.description_ar : feature.description_en;

  // Slight hue rotation per card for visual variety
  const hueOffsets = [0, 30, 60, 200, 240, 280];
  const hue = hueOffsets[index % hueOffsets.length];

  return (
    <motion.div
      variants={cardVariants}
      className="group relative flex flex-col gap-4 rounded-2xl border border-[var(--color-border,theme(colors.slate.200))] dark:border-white/10 bg-[var(--color-bg,white)] dark:bg-[var(--color-surface,theme(colors.slate.900))] p-6 md:p-7 overflow-hidden cursor-default transition-shadow duration-300 hover:shadow-xl dark:hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)]"
    >
      {/* Hover glow overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at 30% 30%, hsl(${hue} 80% 60% / 0.10) 0%, transparent 65%)`,
        }}
      />

      {/* Top border accent — reveals on hover */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, hsl(${hue} 70% 60%), transparent)`,
        }}
      />

      {/* Icon wrapper */}
      <div
        className="relative z-10 flex items-center justify-center w-12 h-12 rounded-xl shrink-0 transition-transform duration-300 group-hover:-translate-y-1"
        style={{
          background: `hsl(${hue} 80% 60% / 0.12)`,
          border: `1.5px solid hsl(${hue} 70% 60% / 0.25)`,
        }}
      >
        <IconComponent
          size={22}
          className="transition-colors duration-300"
          style={{ color: `hsl(${hue} 70% 55%)` }}
          aria-hidden
        />
      </div>

      {/* Text */}
      <div className="relative z-10 flex flex-col gap-1.5">
        <h3 className="text-base md:text-lg font-bold text-[var(--color-text-primary,theme(colors.slate.900))] dark:text-white leading-snug">
          {title || (isRtl ? "ميزة" : "Feature")}
        </h3>
        <p className="text-sm md:text-[0.9rem] leading-relaxed text-[var(--color-text-secondary,theme(colors.slate.500))] dark:text-slate-400">
          {description ||
            (isRtl
              ? "وصف الميزة من هنا."
              : "Feature description goes here.")}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WhyChooseMe({ data }: { data?: WhyChooseMeData }) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const heading =
    (isRtl ? data?.heading_ar : data?.heading_en) ||
    (isRtl ? "لماذا تختارني؟" : "Why Work With Me?");

  const subtitle =
    (isRtl ? data?.subtitle_ar : data?.subtitle_en) ||
    (isRtl
      ? "المزايا التي تجعل كل تعاون قصة نجاح"
      : "The advantages that make every collaboration a success story");

  const features: FeatureItem[] =
    data?.featuresList && data.featuresList.length > 0
      ? data.featuresList
      : FALLBACK_FEATURES;

  return (
    <section
      id="why-choose-me"
      className="relative w-full py-24 md:py-32 overflow-hidden"
      dir={isRtl ? "rtl" : "ltr"}
      aria-label={heading}
    >
      {/* Background decoration */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/5 blur-[140px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Section Header ── */}
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
            className="text-[var(--color-primary,theme(colors.violet.500))] text-xs sm:text-sm font-semibold tracking-widest uppercase mb-3"
          >
            {subtitle}
          </motion.p>

          <TextReveal
            as="h2"
            className="font-heading text-4xl md:text-6xl font-bold text-text-primary justify-center"
          >
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

        {/* ── Features Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              feature={feature}
              isRtl={isRtl}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
