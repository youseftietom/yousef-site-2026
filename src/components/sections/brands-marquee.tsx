"use client";

import React from "react";
import { motion } from "framer-motion";
import { useLocale } from "next-intl";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "../../../sanity/lib/client";

const builder = imageUrlBuilder(client);
/* eslint-disable @typescript-eslint/no-explicit-any */
function urlFor(source: any) {
  return builder.image(source);
}

export default function BrandsMarquee({ data }: { data?: any }) {
  const locale = useLocale();

  const showHeading = data?.showHeading ?? false; 
  const heading = locale === "ar" ? data?.heading_ar : data?.heading_en;
  
  const logos = data?.logos || [];
  const enableAnimation = data?.enableAnimation !== false; 
  const speed = data?.speed || 30; 
  const direction = data?.direction || "left";

  if (!logos.length) return null;

  const displayLogos = enableAnimation ? Array(20).fill(logos).flat() : logos;

  return (
    <section className="py-10 md:py-16 relative bg-transparent">
      
      {showHeading && heading && (
        <h3 className="text-center font-heading text-xs md:text-sm font-bold text-text-secondary mb-6 md:mb-10 opacity-40 tracking-[0.2em] uppercase">
          {heading}
        </h3>
      )}

      {/* شيلنا الـ overflow-hidden عشان اللوجو ميتقصش مهما حصل */}
      <div className="relative w-full flex items-center justify-center overflow-visible">
        <motion.div
          className={`${enableAnimation ? "flex w-max items-center" : "flex flex-wrap items-center justify-center w-full max-w-5xl"} gap-x-12 md:gap-x-20 gap-y-8 px-4`}
          animate={enableAnimation ? { x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"] } : undefined}
          transition={enableAnimation ? {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          } : undefined}
        >
          {displayLogos.map((item: any, index: number) => {
            let imageUrl = "";
            try {
              imageUrl = item?.image?.asset?.url || (item?.image ? urlFor(item.image).url() : "");
            } catch (error) {
              console.error("Error loading image URL:", error);
            }

            if (!imageUrl) return null;

            return (
              <div
                key={index}
                // الحجم هنا متصغر جداً (h-6 للموبايل و h-10 للكمبيوتر) عشان يبقى هادي
                className="relative h-6 md:h-10 flex-shrink-0 flex items-center justify-center group cursor-pointer transition-all duration-300"
              >
                <img
                  src={imageUrl}
                  alt={item.name || "Brand Logo"}
                  // الكلاسات دي بتضمن إن اللوجو يفضل جوه المساحة كامل من غير قص
                  className="max-h-full w-auto object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}