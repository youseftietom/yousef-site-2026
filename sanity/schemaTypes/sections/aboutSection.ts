import { defineField, defineType } from "sanity";

export const aboutSection = defineType({
  name: "aboutSection",
  title: "👤 About Section",
  type: "object",
  fields: [
    defineField({ name: "heading_en", title: "Heading (English)", type: "string", initialValue: "About Me" }),
    defineField({ name: "heading_ar", title: "Heading (Arabic)", type: "string", initialValue: "عني" }),
    defineField({ name: "subtitle_en", title: "Subtitle (English)", type: "text", rows: 3 }),
    defineField({ name: "subtitle_ar", title: "Subtitle (Arabic)", type: "text", rows: 3 }),
    defineField({ name: "bio_en", title: "Bio (English)", type: "text", rows: 6 }),
    defineField({ name: "bio_ar", title: "Bio (Arabic)", type: "text", rows: 6 }),
    defineField({ name: "profileImage", title: "Profile Image", type: "image", options: { hotspot: true } }),
    defineField({ name: "cvFile", title: "CV / Resume File", type: "file", options: { accept: ".pdf" } }),
    defineField({ name: "showStats", title: "Show Statistics", type: "boolean", initialValue: true }),
    defineField({
      name: "statistics", title: "Statistics Items", type: "array", hidden: ({ parent }) => !parent?.showStats,
      of: [{
        type: "object", fields: [
          { name: "value", title: "Value (e.g. 5+)", type: "string" },
          { name: "label_en", title: "Label (English)", type: "string" },
          { name: "label_ar", title: "Label (Arabic)", type: "string" },
        ], preview: { select: { title: 'value', subtitle: 'label_en' } }
      }]
    }),
    defineField({ name: "showVideo", title: "Show Profile Image / Visual", type: "boolean", initialValue: true }),
  ],
  preview: { prepare() { return { title: "👤 About Section" }; } },
});