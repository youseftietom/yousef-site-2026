"use client";

import React from "react";
import Hero from "@/components/sections/hero";
import ProjectsGrid from "@/components/sections/projects-grid";
import About from "@/components/sections/about";
import Experience from "@/components/sections/experience";
import Contact from "@/components/sections/contact";
import SoftwareMarquee from "@/components/sections/software-marquee";
import BrandsMarquee from "../sections/brands-marquee";import Pricing from "@/components/sections/pricing";
import FAQ from "@/components/sections/faq";
import Testimonials from "@/components/sections/testimonials";

/* eslint-disable @typescript-eslint/no-explicit-any */

// 🔴 التعديل هنا: خلينا النوع Record<string, any> عشان نفك خنقة الـ TypeScript 
// وميضربش إيرور لو فيه سكشن مش بياخد settings أو testimonials
const SECTION_MAP: Record<string, any> = {
  heroSection: Hero,
  projectsGridSection: ProjectsGrid,
  aboutSection: About,
  experienceSection: Experience,
  contactSection: Contact,
  softwareMarqueeSection: SoftwareMarquee,
  brandsSection: BrandsMarquee,
  pricingSection: Pricing,
  faqSection: FAQ,
  testimonialSection: Testimonials,
};

interface SectionBlock {
  _type: string;
  _key: string;
  [key: string]: any;
}

interface PageBuilderProps {
  sections: SectionBlock[] | null;
  settings?: any;
}

const DEFAULT_SECTIONS: SectionBlock[] = [
  { _type: "heroSection", _key: "fallback-hero" },
  { _type: "projectsGridSection", _key: "fallback-projects" },
  { _type: "aboutSection", _key: "fallback-about" },
  { _type: "experienceSection", _key: "fallback-experience" },
  { _type: "softwareMarqueeSection", _key: "fallback-marquee" },
  { _type: "brandsSection", _key: "fallback-brands" },
  { _type: "pricingSection", _key: "fallback-pricing" },
  { _type: "testimonialSection", _key: "fallback-testimonials" },
  { _type: "faqSection", _key: "fallback-faq" },
  { _type: "contactSection", _key: "fallback-contact" },
];

export default function PageBuilder({ sections, settings }: PageBuilderProps) {
  const blocks = sections?.length ? sections : DEFAULT_SECTIONS;

  return (
    <>
      {blocks.map((block) => {
        const Component = SECTION_MAP[block._type];
        if (!Component) {
          console.warn(`[PageBuilder] Unknown section type: "${block._type}"`);
          return null;
        }
        
        return (
          <Component 
            key={block._key} 
            data={block} 
            testimonials={block.testimonials} 
            settings={settings} 
          />
        );
      })}
    </>
  );
}