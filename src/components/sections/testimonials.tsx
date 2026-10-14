"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Star, Quote, Image as ImageIcon } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Testimonials({ data, testimonials = [] }: { data?: any; testimonials?: any[] }) {
  const locale = useLocale();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const translateX = useRef<number>(0);
  const singleWidth = useRef<number>(0);
  const bufferCopiesRef = useRef<number>(1);

  const [isDragging, setIsDragging] = useState(false);
  const [repeatCount, setRepeatCount] = useState(3);

  const startX = useRef(0);
  const startTranslateX = useRef(0);
  const isPaused = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  const heading = locale === "ar" ? (data?.heading_ar || "ماذا يقول عملائي") : (data?.heading_en || "What My Clients Say");
  const subtitle = locale === "ar" ? (data?.subtitle_ar || "قصص نجاح وتجارب حقيقية من شركاء النجاح") : (data?.subtitle_en || "Success stories and experiences from my amazing clients.");

  const activeData = testimonials && testimonials.length > 0 ? testimonials : [];
  const duplicatedData = Array.from({ length: repeatCount }, () => activeData).flat();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track || activeData.length === 0 || track.children.length === 0) return;

    const containerWidth = container.offsetWidth;
    
    // 🔑 الإصلاح الرئيسي: حساب العرض الفعلي للعنصر الأول بدلاً من الاعتماد على scrollWidth
    // هذا يمنع خطأ المتصفحات في حساب الـ RTL ويمنع الـ Infinite Loop الذي يخفي المكون
    const firstItem = track.children[0] as HTMLElement;
    const style = window.getComputedStyle(firstItem);
    const margin = (parseFloat(style.marginRight) || 0) + (parseFloat(style.marginLeft) || 0);
    const itemWidth = firstItem.getBoundingClientRect().width + margin;
    
    const sw = itemWidth * activeData.length;
    if (sw <= 0) return;

    const neededBuffer = Math.max(1, Math.ceil(containerWidth / sw) + 1);
    const neededRepeat = neededBuffer * 2 + 1;

    if (neededRepeat !== repeatCount) {
      setRepeatCount(neededRepeat);
      return; 
    }

    singleWidth.current = sw;
    bufferCopiesRef.current = neededBuffer;
    translateX.current = -neededBuffer * sw;
    track.style.transform = `translate3d(${translateX.current}px, 0, 0)`;
  }, [repeatCount, activeData.length, locale]);

  const wrap = (value: number) => {
    const sw = singleWidth.current;
    const buf = bufferCopiesRef.current;
    if (sw <= 0) return value;
    let v = value % sw;
    if (v > 0) v -= sw; 
    return v - buf * sw; 
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !isVisible || activeData.length === 0 || singleWidth.current <= 0) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollStep = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isPaused.current && !isDragging) {
        const speedPixelsPerSecond = data?.speed || 45;
        const step = (speedPixelsPerSecond * delta) / 1000;
        const direction = -1;

        translateX.current = wrap(translateX.current + direction * step);
        track.style.transform = `translate3d(${translateX.current}px, 0, 0)`;
      }

      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isVisible, isDragging, activeData.length, locale, data?.speed, repeatCount]);

  const getClientX = (e: any) => e.pageX ?? e.touches?.[0]?.pageX ?? 0;

  const startDragging = (e: any) => {
    setIsDragging(true);
    isPaused.current = true;
    startX.current = getClientX(e);
    startTranslateX.current = translateX.current;
  };

  const stopDragging = () => {
    setIsDragging(false);
    isPaused.current = false;
  };

  const moveDragging = (e: any) => {
    if (!isDragging || !trackRef.current || singleWidth.current <= 0) return;
    const x = getClientX(e);
    const walk = (x - startX.current) * 1.5;
    translateX.current = wrap(startTranslateX.current + walk);
    trackRef.current.style.transform = `translate3d(${translateX.current}px, 0, 0)`;
  };

  if (activeData.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden bg-transparent text-text-primary transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{heading}</h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-text-secondary text-lg max-w-2xl mx-auto"
          >
            {subtitle}
          </motion.p>
        </div>
      </div>

      <div
        ref={containerRef}
        dir="ltr"
        className="relative w-full overflow-hidden py-4"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      >
        <div
          dir="ltr"
          onMouseDown={startDragging}
          onMouseMove={moveDragging}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onMouseEnter={() => { isPaused.current = true; }}
          onTouchStart={startDragging}
          onTouchMove={moveDragging}
          onTouchEnd={stopDragging}
          onTouchCancel={stopDragging}
          className={`w-full overflow-hidden py-4 px-4 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        >
          <div
            ref={trackRef}
            dir="ltr"
            /* 🔑 تمت إضافة w-max هنا لضمان عدم تأثر السلايدر بقياسات الشاشة في الوضع العربي */
            className="flex w-max will-change-transform"
            style={{ transform: "translate3d(0,0,0)" }}
          >
            {duplicatedData.map((item, index) => {
              const clientName = locale === "ar" ? (item.name_ar || item.name_en) : (item.name_en || item.name_ar);
              const clientRole = locale === "ar" ? (item.role_ar || item.role_en) : (item.role_en || item.role_ar);
              const clientText = locale === "ar" ? (item.text_ar || item.text_en) : (item.text_en || item.text_ar);
              const isImage = item.reviewType === "image" && item.chatScreenshot?.asset?.url;

              return (
                <div
                  key={`${item._id}-${index}`}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  className="mr-6 md:mr-8 relative w-[320px] md:w-[450px] shrink-0 p-8 rounded-[2.5rem] bg-surface border border-border/50 hover:border-primary/50 transition-all duration-300 group flex flex-col justify-between overflow-hidden min-h-[320px] shadow-sm"
                >
                  {isImage ? (
                    <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-6 border border-border/40 bg-background/50 pointer-events-none">
                      <img src={item.chatScreenshot.asset.url} alt="Chat" className="w-full h-full object-contain" loading="lazy" />
                      <div className="absolute top-2 right-2 bg-background/80 p-2 rounded-full backdrop-blur-sm shadow-md">
                        <ImageIcon size={16} className="text-primary" />
                      </div>
                    </div>
                  ) : (
                    <div className="pointer-events-none">
                      <Quote className="absolute -bottom-6 -right-6 w-32 h-32 text-primary/5 -rotate-12 group-hover:text-primary/10 transition-colors duration-300" />
                      <div className="relative z-10">
                        <div className="flex gap-1 mb-6">
                          {[...Array(item.rating || 5)].map((_, i) => (
                            <Star key={i} size={18} className="fill-yellow-500 text-yellow-500" />
                          ))}
                        </div>
                        <p className="text-text-primary text-lg leading-relaxed mb-8 font-medium italic">&quot;{clientText}&quot;</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 relative z-10 mt-auto border-t border-border/30 pt-6 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-lg shrink-0 shadow-inner">
                      {clientName?.charAt(0) || "C"}
                    </div>
                    <div>
                      <h4 className="text-text-primary font-bold text-base">{clientName}</h4>
                      <p className="text-text-secondary text-sm">{clientRole}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}