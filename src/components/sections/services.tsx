"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image"; 
import {
  Video,
  Palette,
  Monitor,
  Film,
  Smartphone,
  PenTool,
  Camera,
  Layout,
  Target,
  Zap,
  Gem,
  Flame,
  MessageCircle,
  ArrowUpRight,
  Presentation,
  Check,
} from "lucide-react";
import TextReveal from "@/components/animations/text-reveal";

/* eslint-disable @typescript-eslint/no-explicit-any */

const ICON_MAP: Record<string, any> = {
  video: Video,
  palette: Palette,
  monitor: Monitor,
  film: Film,
  smartphone: Smartphone,
  "pen-tool": PenTool,
  camera: Camera,
  layout: Layout,
  target: Target,
  zap: Zap,
  gem: Gem,
  flame: Flame,
  presentation: Presentation,
};

const panelContainerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
  exit: { transition: { staggerChildren: 0.02 } },
};

const panelItemVariants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15 } },
};

const staticContainerVariants = {
  hidden: {},
  show: {},
  exit: {},
};

const staticItemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
  exit: { opacity: 0 },
};

const FALLBACK_SERVICES = [
  {
    _key: "fb-1",
    title_en: "Video Editing & Reels",
    title_ar: "مونتاج فيديو وريلز",
    description_en: "Professional video editing, reels production, and content creation that captures attention and drives engagement across all platforms.",
    description_ar: "مونتاج فيديو احترافي، إنتاج ريلز، وصناعة محتوى يلفت الانتباه ويزود التفاعل على كل المنصات.",
    features_en: ["Reels & short-form cuts built to hold attention", "Color grading & sound design", "Fast turnaround for daily content"],
    features_ar: ["مونتاج ريلز وفيديوهات قصيرة بتشد المتابع من أول ثانية", "كولور جريدنج وتصميم صوتي", "تسليم سريع يواكب المحتوى اليومي"],
    icon: "video",
    category: "video-editing",
  },
  {
    _key: "fb-2",
    title_en: "Motion Graphics",
    title_ar: "موشن جرافيك",
    description_en: "Eye-catching motion graphics and animated visuals that bring your brand story to life with cinematic quality and smooth transitions.",
    description_ar: "موشن جرافيك ورسوم متحركة ملفتة بتحول قصة براندك لحياة بجودة سينمائية وانتقالات سلسة.",
    features_en: ["Animated logos & lower thirds", "Kinetic typography for storytelling", "Smooth transitions & VFX polish"],
    features_ar: ["لوجوهات متحركة ولاور ثيرد", "تايبوجرافي متحرك بيحكي القصة", "انتقالات ناعمة ولمسات VFX"],
    icon: "film",
    category: "motion-graphics",
  },
  {
    _key: "fb-3",
    title_en: "Graphic Design",
    title_ar: "تصميم جرافيك",
    description_en: "Creative graphic design solutions from brand identities and logos to marketing materials that make your brand stand out.",
    description_ar: "حلول تصميم جرافيك إبداعية من هوية بصرية ولوجوهات لمواد تسويقية بتخلي البراند بتاعك مميز.",
    features_en: ["Brand identity & logo systems", "Print-ready marketing materials", "A consistent visual language"],
    features_ar: ["هوية بصرية ونظام لوجو متكامل", "مواد تسويقية جاهزة للطباعة", "لغة بصرية موحدة للبراند"],
    icon: "palette",
    category: "graphic-design",
  },
  {
    _key: "fb-4",
    title_en: "Social Media Design",
    title_ar: "تصميمات سوشيال ميديا",
    description_en: "Scroll-stopping social media designs, posts, stories, and campaign visuals that boost your brand presence and engagement.",
    description_ar: "تصميمات سوشيال ميديا ملفتة، بوستات، ستوريز، وحملات بتعزز حضور البراند وتفاعل الجمهور.",
    features_en: ["Feed, story & carousel templates", "Campaign-ready visual sets", "Sizing built for every platform"],
    features_ar: ["قوالب بوستات، ستوريز، وكاروسيل", "مجموعات بصرية جاهزة للحملات", "مقاسات وصيغ مظبوطة لكل منصة"],
    icon: "smartphone",
    category: "graphic-design",
  },
  {
    _key: "fb-5",
    title_en: "UI/UX Design",
    title_ar: "تصميم واجهات المستخدم",
    description_en: "Intuitive and beautiful user interface designs that provide seamless experiences across web and mobile applications.",
    description_ar: "تصميم واجهات مستخدم بديهية وجميلة بتوفر تجربة سلسة للمواقع والتطبيقات.",
    features_en: ["Wireframes to high-fidelity screens", "User flows built around real behavior", "Design systems for web & mobile"],
    features_ar: ["من الويرفريم للشاشات النهائية", "تدفقات استخدام مبنية على سلوك حقيقي", "نظام تصميم موحد للويب والموبايل"],
    icon: "monitor",
    category: "ui-ux",
  },
  {
    _key: "fb-6",
    title_en: "Company Profiles & Presentations",
    title_ar: "بروفايل الشركات والعروض التقديمية",
    description_en: "Professional presentation designs, corporate profiles, and annual reports that reflect your identity and impress your clients.",
    description_ar: "تصميم عروض تقديمية احترافية، بروفايلات شركات، وتقارير سنوية بتعكس هويتك وتبهر عملائك بصورة رسمية وراقية.",
    features_en: ["Investor-ready pitch decks", "Annual reports & corporate profiles", "Slide systems built for reuse"],
    features_ar: ["عروض تقديمية جاهزة للمستثمرين", "بروفايلات شركات وتقارير سنوية", "نظام سلايدات قابل لإعادة الاستخدام"],
    icon: "presentation",
    category: "corporate-design",
  },
];

function getFeatures(service: any, locale: string): string[] {
  const raw = locale === "ar" ? service.features_ar : service.features_en;
  if (Array.isArray(raw) && raw.length > 0) return raw.slice(0, 4);

  const description = locale === "ar" ? service.description_ar : service.description_en;
  if (!description) return [];
  
  return description
    .split(/[\n.!؟،-]/)
    .map((s: string) => s.trim())
    .filter((s: string) => s.length > 2)
    .slice(0, 4);
}

function ServicePanelContent({
  service,
  index,
  title,
  features,
  waLink,
  onPortfolioClick,
  orderBtnText,
  portfolioBtnText,
  compact,
  itemVariants,
}: {
  service: any;
  index: number;
  title: string;
  features: string[];
  waLink: string;
  onPortfolioClick: () => void;
  orderBtnText: string;
  portfolioBtnText: string;
  compact?: boolean;
  itemVariants: any;
}) {
  const IconComponent = ICON_MAP[service.icon] || Palette;
  const lightIcon = service.customIconLight?.asset?.url;
  const darkIcon = service.customIconDark?.asset?.url;

  return (
    <>
      <motion.div variants={itemVariants} className="flex items-center justify-between mb-6 md:mb-8">
        <div className={`rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary overflow-hidden relative ${compact ? "w-12 h-12" : "w-16 h-16"}`}>
          
          {lightIcon || darkIcon ? (
            <>
              {lightIcon && (
                <Image 
                  src={lightIcon} 
                  alt={title || "Service Icon"} 
                  fill
                  sizes="(max-width: 768px) 48px, 64px"
                  className={`object-contain p-2.5 ${darkIcon ? 'block dark:hidden' : ''}`}
                />
              )}
              {darkIcon && (
                <Image 
                  src={darkIcon} 
                  alt={title || "Service Icon"} 
                  fill
                  sizes="(max-width: 768px) 48px, 64px"
                  className={`object-contain p-2.5 ${lightIcon ? 'hidden dark:block' : ''}`}
                />
              )}
            </>
          ) : (
            <IconComponent size={compact ? 22 : 28} strokeWidth={1.5} />
          )}

        </div>
        {/* 👇 التعديل هنا: زودنا وضوح الرقم وعدلناه للايت والدارك مود عشان يبقى مقروء وواضح 👇 */}
        <span className={`font-heading font-black text-text-primary opacity-40 dark:opacity-60 select-none ${compact ? "text-4xl" : "text-6xl"}`}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>

      <motion.h3 variants={itemVariants} className={`font-heading font-bold text-text-primary mb-5 md:mb-6 ${compact ? "text-xl" : "text-2xl md:text-3xl"}`}>
        {title}
      </motion.h3>

      <ul className={`space-y-3 flex-1 ${compact ? "mb-6" : "mb-10"}`}>
        {features.map((feature, fi) => (
          <motion.li key={fi} variants={itemVariants} className={`flex items-start gap-3 text-text-secondary leading-relaxed ${compact ? "text-sm" : "text-base"}`}>
            <span className="mt-1 shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Check size={12} strokeWidth={3} />
            </span>
            {feature}
          </motion.li>
        ))}
      </ul>

      <motion.div variants={itemVariants} className="flex flex-row items-center gap-3 pt-6 border-t border-border/30">
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 px-2 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-1">
          <MessageCircle size={18} />
          <span className="truncate">{orderBtnText}</span>
        </a>
        <button onClick={onPortfolioClick} className="flex-1 flex items-center justify-center gap-2 py-3 px-2 bg-transparent text-text-primary border border-border/60 hover:border-primary/50 hover:bg-primary/5 rounded-xl font-bold text-sm transition-all duration-300 hover:-translate-y-1">
          <span className="truncate">{portfolioBtnText}</span>
          <ArrowUpRight size={18} />
        </button>
      </motion.div>
    </>
  );
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export default function Services({ data, settings }: { data?: any; settings?: any }) {
  const t = useTranslations("services");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const reducedMotion = useReducedMotion();

  const heading = (locale === "ar" ? data?.heading_ar : data?.heading_en) || t("title");
  const subtitle = (locale === "ar" ? data?.subtitle_ar : data?.subtitle_en) || t("subtitle");

  const sanityServices = data?.services;
  const services: any[] = sanityServices && sanityServices.length > 0 ? sanityServices : FALLBACK_SERVICES;

  const sectionWa = data?.whatsappNumber?.replace(/[^0-9]/g, "") || "";
  const settingsWa = settings?.whatsappNumber?.replace(/[^0-9]/g, "") || "";
  const whatsappNumber = sectionWa || settingsWa;

  const showBanner = data?.showContactBanner ?? false;
  
  const bannerTitle = (locale === "ar" ? data?.bannerTitle_ar : data?.bannerTitle_en) || (locale === "ar" ? "هل لديك مشروع جديد؟" : "Have a New Project?");
  const bannerDesc = (locale === "ar" ? data?.bannerDesc_ar : data?.bannerDesc_en) || (locale === "ar" ? "دعنا نناقش التفاصيل ونحول فكرتك إلى واقع ملموس." : "Let's discuss the details and turn your idea into reality.");
  const bannerBtn = (locale === "ar" ? data?.bannerBtn_ar : data?.bannerBtn_en) || (locale === "ar" ? "ناقش فكرتك معنا عبر واتساب" : "Discuss Your Idea on WhatsApp");
  const bannerWaLink = `https://wa.me/${whatsappNumber}`;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeService = services[activeIndex] || services[0];

  const selectService = (i: number) => {
    setActiveIndex(i);
    cardRefs.current[i]?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.6) {
            const idx = Number(entry.target.getAttribute("data-index"));
            if (!Number.isNaN(idx)) setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: [0.6] }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [services.length]);

  const buildWaLink = (service: any) => {
    const title = locale === "ar" ? service.title_ar : service.title_en;
    const msg = encodeURIComponent(
      locale === "ar" ? `مرحباً، أود مناقشة تفاصيل خدمة: ${title}` : `Hello, I'd like to discuss the service: ${title}`
    );
    return `https://wa.me/${whatsappNumber}?text=${msg}`;
  };

  const getOrderBtnText = (service: any) => (locale === "ar" ? service.orderBtn_ar : service.orderBtn_en) || (locale === "ar" ? "ابدأ مشروعك الآن" : "Start Your Project");
  const getPortfolioBtnText = (service: any) => (locale === "ar" ? service.portfolioBtn_ar : service.portfolioBtn_en) || (locale === "ar" ? "استكشف سابقة أعمالنا" : "Explore Our Work");

  const goToPortfolio = (service: any) => {
    const category = service.category;
    if (category) {
      window.location.hash = `#projects-${category}`;
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    }
    setTimeout(() => {
      const projectsSection = document.getElementById("projects");
      if (projectsSection) {
        projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <section id="services" className="section-spacing relative bg-transparent text-text-primary overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="mb-10 text-center relative z-10">
          <TextReveal as="h2" className="font-heading text-4xl md:text-6xl font-bold text-text-primary justify-center flex">
            {heading}
          </TextReveal>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-text-secondary text-sm mt-2 max-w-lg mx-auto">
            {subtitle}
          </motion.p>
        </div>

        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-[360px_1fr] gap-8 relative z-10">
          <div className="flex flex-col border-e border-border/40 pe-2">
            {services.map((service: any, i: number) => {
              const title = isRTL ? service.title_ar : service.title_en;
              const isActive = i === activeIndex;
              return (
                <button key={service._key || i} onClick={() => selectService(i)} className="relative text-start py-5 group focus:outline-none" aria-current={isActive}>
                  <div className="flex items-baseline gap-4">
                    <span className={`font-heading text-sm font-bold tabular-nums transition-colors duration-300 ${isActive ? "text-primary" : "text-text-secondary/40 group-hover:text-text-secondary/70"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className={`font-heading text-lg font-bold transition-colors duration-300 ${isActive ? "text-text-primary" : "text-text-secondary/60 group-hover:text-text-primary/80"}`}>
                      {title}
                    </span>
                  </div>
                  <div className="mt-4 h-[3px] w-full rounded-full bg-border/30 overflow-hidden">
                    <div className={`h-full bg-primary rounded-full transition-all duration-300 ${isActive ? "w-full" : "w-0"}`} />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative rounded-3xl bg-gradient-to-b from-surface/40 to-surface/10 backdrop-blur-lg border border-border/40 p-10 md:p-12 min-h-[420px] overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={activeService._key || activeIndex} variants={reducedMotion ? staticContainerVariants : panelContainerVariants} initial="hidden" animate="show" exit="exit" className="relative h-full flex flex-col">
                <ServicePanelContent
                  service={activeService}
                  index={activeIndex}
                  title={isRTL ? activeService.title_ar : activeService.title_en}
                  features={getFeatures(activeService, locale)}
                  waLink={buildWaLink(activeService)}
                  onPortfolioClick={() => goToPortfolio(activeService)}
                  orderBtnText={getOrderBtnText(activeService)}
                  portfolioBtnText={getPortfolioBtnText(activeService)}
                  itemVariants={reducedMotion ? staticItemVariants : panelItemVariants}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden relative z-10">
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-6 px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {services.map((service: any, i: number) => {
              const isActive = i === activeIndex;
              return (
                <div key={service._key || i} ref={(el) => { cardRefs.current[i] = el; }} data-index={i} className={`snap-center shrink-0 w-[86%] rounded-3xl bg-gradient-to-b from-surface/40 to-surface/10 backdrop-blur-lg border p-6 transition-colors duration-300 ${isActive ? "border-primary/30" : "border-border/40"}`}>
                  <motion.div variants={staticItemVariants} initial="show" animate="show" className="flex flex-col h-full">
                    <ServicePanelContent
                      service={service}
                      index={i}
                      title={isRTL ? service.title_ar : service.title_en}
                      features={getFeatures(service, locale)}
                      waLink={buildWaLink(service)}
                      onPortfolioClick={() => goToPortfolio(service)}
                      orderBtnText={getOrderBtnText(service)}
                      portfolioBtnText={getPortfolioBtnText(service)}
                      compact
                      itemVariants={staticItemVariants}
                    />
                  </motion.div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-center gap-2 mt-5">
            {services.map((service: any, i: number) => (
              <button key={service._key || i} onClick={() => selectService(i)} aria-label={isRTL ? service.title_ar : service.title_en} className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "w-6 bg-primary" : "w-2 bg-border/50"}`} />
            ))}
          </div>
        </div>

        {/* Contact Banner */}
        {showBanner && whatsappNumber && (
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.6, type: "spring" }} className="mt-24 relative p-8 md:p-14 rounded-[2rem] bg-gradient-to-r from-surface to-surface/50 border border-border shadow-xl shadow-black/5 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
            <div className="relative z-10 max-w-2xl text-center md:text-start">
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4 leading-tight">
                {bannerTitle}
              </h3>
              <p className="text-text-secondary text-base md:text-lg">
                {bannerDesc}
              </p>
            </div>
            <div className="relative z-10 shrink-0 w-full md:w-auto mt-4 md:mt-0">
              <a href={bannerWaLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/30 hover:-translate-y-1">
                <MessageCircle size={22} />
                {bannerBtn}
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}