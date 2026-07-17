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
        { type: "projectsGridSection" },
        { type: "aboutSection" },
        { type: "experienceSection" },
        { type: "softwareMarqueeSection" },
        { type: "brandsSection" }, // 👈 قسم البراندات ظهر هنا في الداش بورد
        { type: "pricingSection" },
        { type: "faqSection" },
        { type: "testimonialSection" },
        { type: "contactSection" },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "🏗️ Homepage Builder" };
    },
  },
});