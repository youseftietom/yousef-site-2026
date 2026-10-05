import { project } from "./project";
import { about } from "./about";
import { experience } from "./experience";
import { siteSettings } from "./siteSettings";
import { homepage } from "./homepage";
import { testimonial } from "./testimonial";

import { heroSection } from "./sections/heroSection";
import { projectsGridSection } from "./sections/projectsGridSection";
import { aboutSection } from "./sections/aboutSection";
import { experienceSection } from "./sections/experienceSection";
import { softwareMarqueeSection } from "./sections/softwareMarqueeSection";
import { pricingSection } from "./sections/pricingSection";
import { faqSection } from "./sections/faqSection";
import { contactSection } from "./sections/contactSection";
import { testimonialSection } from "./sections/testimonialSection";
import { brandsSection } from "./sections/brandsSection"; 
import { servicesSection } from "./sections/servicesSection"; // 👈 استدعاء ملف الخدمات
import { showreelSection } from "./sections/showreelSection"; // 🎬 Showreel section
import { statsSection } from "./sections/statsSection"; // 📊 Stats Section
import { whyChooseMeSection } from "./sections/whyChooseMeSection"; // ✨ Why Choose Me Section

export const schemaTypes = [
  homepage,
  project,
  about,
  experience,
  siteSettings,
  testimonial,
  heroSection,
  projectsGridSection,
  aboutSection,
  experienceSection,
  softwareMarqueeSection,
  pricingSection,
  faqSection,
  contactSection,
  testimonialSection,
  brandsSection, 
  servicesSection, // 👈 إضافة القسم للـ Sanity
  showreelSection, // 🎬 Showreel section
  statsSection, // 📊 Stats Section
  whyChooseMeSection, // ✨ Why Choose Me Section
];