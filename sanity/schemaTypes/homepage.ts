import { defineField, defineType } from "sanity";

export const homepage = defineType({
  name: "homepage",
  title: "🏗️ Homepage",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title (internal reference)",
      type: "string",
      initialValue: "Homepage",
      hidden: true,
    }),
    defineField({
      name: "pageBuilder",
      title: "Page Builder — Drag & Drop Sections",
      description: "Add, remove, and reorder sections. Each section is fully configurable.",
      type: "array",
      of: [
        { type: "heroSection" },
        { type: "servicesSection" }, // 👈 قسم الخدمات ظهر هنا في الداش بورد
        { type: "projectsGridSection" },
        { type: "aboutSection" },
        { type: "experienceSection" },
        { type: "softwareMarqueeSection" },
        { type: "brandsSection" }, 
        { type: "pricingSection" },
        { type: "faqSection" },
        { type: "testimonialSection" },
        { type: "contactSection" },
        { type: "showreelSection" }, // 🎬 Showreel / Featured Video section
        { type: "statsSection" }, // 📊 Stats Section
        { type: "whyChooseMeSection" }, // ✨ Why Choose Me Section
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "🏗️ Homepage Builder" };
    },
  },
});