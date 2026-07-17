"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Check, X, MessageCircle } from "lucide-react";
import TextReveal from "@/components/animations/text-reveal";
import DynamicPrice from "@/components/ui/dynamic-price";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface Feature {
  text_en?: string;
  text_ar?: string;
  included?: boolean;
}

interface AlaCarteService {
  name_en?: string;
  name_ar?: string;
  price?: string;
  numericPrice?: number;
}

interface Plan {
  name_en?: string;
  name_ar?: string;
  price?: string;
  numericPrice?: number;
  period_en?: string;
  period_ar?: string;
  description_en?: string;
  description_ar?: string;
  features?: Feature[];
  highlighted?: boolean;
  ctaText_en?: string;
  ctaText_ar?: string;
  ctaLink?: string;
}

interface Props {
  data?: {
    heading_en?: string;
    heading_ar?: string;
    subtitle_en?: string;
    subtitle_ar?: string;
    plans?: Plan[];
    
    // Option 1: A la Carte
    showAlaCarte?: boolean;
    alaCarteHeading_en?: string;
    alaCarteHeading_ar?: string;
    alaCarteServices?: AlaCarteService[];

    // Option 2: WhatsApp Banner
    showWhatsappBanner?: boolean;
    whatsappHeading_en?: string;
    whatsappHeading_ar?: string;
    whatsappDesc_en?: string;
    whatsappDesc_ar?: string;
    whatsappBtn_en?: string;
    whatsappBtn_ar?: string;
    whatsappNumber?: string;
  };
  settings?: any; 
}

export default function Pricing({ data, settings }: Props) {
  const locale = useLocale();
  const heading = locale === "ar" ? data?.heading_ar : data?.heading_en;
  const subtitle = locale === "ar" ? data?.subtitle_ar : data?.subtitle_en;
  const plans = data?.plans || [];

  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // بيانات قسم الخدمات الفردية
  const showAlaCarte = data?.showAlaCarte ?? false;
  const alaCarteHeading = locale === "ar" ? data?.alaCarteHeading_ar : data?.alaCarteHeading_en;
  const alaCarteServices = data?.alaCarteServices || [];

  // بيانات بانر الواتساب
  const showWhatsapp = data?.showWhatsappBanner ?? false;
  const waHeading = locale === "ar" ? data?.whatsappHeading_ar : data?.whatsappHeading_en;
  const waDesc = locale === "ar" ? data?.whatsappDesc_ar : data?.whatsappDesc_en;
  const waBtn = locale === "ar" ? data?.whatsappBtn_ar : data?.whatsappBtn_en;
  // تنظيف الرقم من أي مسافات أو رموز عشان اللينك يشتغل صح
  const cleanWaNumber = data?.whatsappNumber?.replace(/[^0-9]/g, '') || "";
  const waLink = `https://wa.me/${cleanWaNumber}`;

  return (
    <section id="pricing" className="section-spacing relative">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* 🔴 1. الهيدر الرئيسي (زي ما هو) */}
        <div className="mb-16 text-center">
          <TextReveal as="h2" className="font-heading text-4xl md:text-6xl font-bold text-text-primary justify-center">
            {heading || (locale === "ar" ? "الأسعار" : "Pricing")}
          </TextReveal>
          {subtitle && (
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-text-secondary text-lg mt-4 max-w-lg mx-auto">
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* 🔴 2. الباقات الأساسية (زي ما هي بالمللي) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const name = locale === "ar" ? plan.name_ar : plan.name_en;
            const period = locale === "ar" ? plan.period_ar : plan.period_en;
            const desc = locale === "ar" ? plan.description_ar : plan.description_en;
            const cta = locale === "ar" ? plan.ctaText_ar : plan.ctaText_en;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`glass-card p-8 flex flex-col relative ${plan.highlighted ? "border-primary ring-1 ring-primary/20" : ""}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full uppercase">
                    {locale === "ar" ? "الأفضل" : "Popular"}
                  </div>
                )}

                <h3 className="font-heading text-xl font-bold text-text-primary">{name}</h3>
                
                <div className="mt-4 mb-2 flex items-baseline gap-1">
                  <DynamicPrice 
                    amount={plan.numericPrice} 
                    fallbackPrice={plan.price || ""} 
                    settings={settings} 
                  />
                  {period && <span className="text-text-muted text-sm ms-1">/ {period}</span>}
                </div>
                
                {desc && <p className="text-text-secondary text-sm mb-6">{desc}</p>}

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features?.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3 text-sm">
                      {f.included ? <Check size={16} className="text-green-500 flex-shrink-0" /> : <X size={16} className="text-text-muted flex-shrink-0" />}
                      <span className={f.included ? "text-text-primary" : "text-text-muted line-through"}>
                        {locale === "ar" ? f.text_ar : f.text_en}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => scrollTo(plan.ctaLink || "#contact")}
                  className={`w-full justify-center flex items-center h-12 px-6 rounded-full font-bold text-sm transition-colors duration-200 border-2 ${
                    plan.highlighted 
                      ? "border-primary bg-primary/10 text-primary hover:bg-primary hover:text-white" 
                      : "border-text-primary/20 text-text-primary hover:border-text-primary hover:bg-text-primary/5" 
                  }`}
                >
                  {cta}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* 🔴 3. الأوبشن الأول: الخدمات الفردية بتسعير ذكي (A la carte) */}
        {showAlaCarte && alaCarteServices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 w-full max-w-4xl mx-auto"
          >
            <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
              {alaCarteHeading || (locale === "ar" ? "خدمات فردية" : "Individual Services")}
            </h3>
            
            <div className="glass-card p-6 rounded-3xl border border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {alaCarteServices.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-surface-hover/50 border border-white/5 hover:border-primary/30 transition-colors">
                  <span className="font-medium text-text-primary text-sm md:text-base">
                    {locale === "ar" ? service.name_ar : service.name_en}
                  </span>
                  <div className="font-bold text-primary">
                    {/* السعر هنا شغال ذكي بيسمع في الكهربا بتاعتك */}
                    <DynamicPrice 
                      amount={service.numericPrice} 
                      fallbackPrice={service.price || ""} 
                      settings={settings} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 🔴 4. الأوبشن التاني: بانر الواتساب المباشر */}
        {showWhatsapp && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-12 w-full"
          >
            <div className="glass-card p-6 md:p-8 rounded-3xl border border-emerald-500/30 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-r from-emerald-500/5 to-transparent">
              
              <div className="relative z-10 text-center md:text-start md:max-w-xl">
                <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2 flex items-center justify-center md:justify-start gap-2">
                  <MessageCircle className="text-emerald-500" size={24} />
                  {waHeading}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {waDesc}
                </p>
              </div>

              <div className="relative z-10 w-full md:w-auto shrink-0 mt-2 md:mt-0">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto px-8 py-3 rounded-full bg-emerald-500 text-white font-bold text-sm hover:bg-emerald-600 hover:scale-105 transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  {waBtn}
                </a>
              </div>

            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}