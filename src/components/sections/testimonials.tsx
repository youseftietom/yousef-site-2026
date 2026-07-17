"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import { Star, Quote, Image as ImageIcon } from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Testimonials({ data, testimonials = [] }: { data?: any; testimonials?: any[] }) {
  const locale = useLocale();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // خلينا القيمة المبدئية 0 عشان TypeScript ميعملش Error
  const exactScroll = useRef<number>(0);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const isPaused = useRef(false);

  const heading = locale === "ar" ? (data?.heading_ar || "ماذا يقول عملائي") : (data?.heading_en || "What My Clients Say");
  const subtitle = locale === "ar" ? (data?.subtitle_ar || "قصص نجاح وتجارب حقيقية من شركاء النجاح") : (data?.subtitle_en || "Success stories and experiences from my amazing clients.");
  
  const activeData = testimonials && testimonials.length > 0 ? testimonials : [];
  const duplicatedData = [...activeData, ...activeData, ...activeData, ...activeData];

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || activeData.length === 0) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    // تحديث القيمة في البداية
    exactScroll.current = el.scrollLeft;

    const scrollStep = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isPaused.current && !isDragging) {
        const halfWidth = el.scrollWidth / 2;
        const speedPixelsPerSecond = data?.speed || 45; 
        const step = (speedPixelsPerSecond * delta) / 1000;
        
        if (locale === "ar") {
          exactScroll.current += step; 
          if (exactScroll.current >= 0) {
            exactScroll.current -= halfWidth;
          }
        } else {
          exactScroll.current += step;
          if (exactScroll.current >= halfWidth) {
            exactScroll.current -= halfWidth;
          }
        }
        
        el.scrollLeft = exactScroll.current;
      } else {
        exactScroll.current = el.scrollLeft;
      }
      
      animationFrameId = requestAnimationFrame(scrollStep);
    };

    animationFrameId = requestAnimationFrame(scrollStep);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging, activeData.length, locale, data?.speed]);

  const startDragging = (e: any) => {
    setIsDragging(true);
    isPaused.current = true;
    const x = e.pageX || (e.touches && e.touches[0].pageX);
    setStartX(x - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const stopDragging = () => {
    setIsDragging(false);
    isPaused.current = false;
  };

  const moveDragging = (e: any) => {
    if (!isDragging || !scrollRef.current) return;
    const x = e.pageX || (e.touches && e.touches[0].pageX);
    const walk = (x - (scrollRef.current.offsetLeft || 0) - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
    exactScroll.current = scrollRef.current.scrollLeft; 
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

      <div className="relative w-full overflow-hidden py-4">
        <div
          ref={scrollRef}
          onMouseDown={startDragging}
          onMouseMove={moveDragging}
          onMouseUp={stopDragging}
          onMouseLeave={stopDragging}
          onMouseEnter={() => { isPaused.current = true; }}
          onTouchStart={startDragging}
          onTouchMove={moveDragging}
          onTouchEnd={stopDragging}
          onTouchCancel={stopDragging} 
          className={`flex w-full overflow-x-auto py-4 px-4 no-scrollbar select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
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
                    <img src={item.chatScreenshot.asset.url} alt="Chat" className="w-full h-full object-contain" />
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
                      <p className="text-text-primary text-lg leading-relaxed mb-8 font-medium italic">"{clientText}"</p>
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
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}