import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "⚙️ Site Settings",
  type: "document",
  groups: [
    { name: "general", title: "General", default: true },
    { name: "themeColors", title: "🎨 Theme Colors" },
    { name: "social", title: "Social & Contact" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    /* ═══ GENERAL ═══ */
    defineField({
      name: "siteTitle",
      title: "Site Title",
      type: "string",
      group: "general",
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number (with country code, no + sign)",
      type: "string",
      description: "Example: 201142545272",
      group: "general",
    }),

    /* ═══ THEME COLORS — LIGHT MODE ═══ */
    defineField({
      name: "lightBackground",
      title: "Light Mode — Background",
      type: "color",
      group: "themeColors",
      options: { disableAlpha: true },
    }),
    defineField({
      name: "lightSurface",
      title: "Light Mode — Surface",
      type: "color",
      group: "themeColors",
      options: { disableAlpha: true },
    }),
    defineField({
      name: "lightPrimary",
      title: "Light Mode — Primary Accent",
      type: "color",
      group: "themeColors",
      options: { disableAlpha: true },
    }),
    defineField({
      name: "lightTextPrimary",
      title: "Light Mode — Text Primary",
      type: "color",
      group: "themeColors",
      options: { disableAlpha: true },
    }),
    defineField({
      name: "lightTextSecondary",
      title: "Light Mode — Text Secondary",
      type: "color",
      group: "themeColors",
      options: { disableAlpha: true },
    }),

    /* ═══ THEME COLORS — DARK MODE ═══ */
    defineField({
      name: "darkBackground",
      title: "Dark Mode — Background",
      type: "color",
      group: "themeColors",
      options: { disableAlpha: true },
    }),
    defineField({
      name: "darkSurface",
      title: "Dark Mode — Surface",
      type: "color",
      group: "themeColors",
      options: { disableAlpha: true },
    }),
    defineField({
      name: "darkPrimary",
      title: "Dark Mode — Primary Accent",
      type: "color",
      group: "themeColors",
      options: { disableAlpha: true },
    }),
    defineField({
      name: "darkTextPrimary",
      title: "Dark Mode — Text Primary",
      type: "color",
      group: "themeColors",
      options: { disableAlpha: true },
    }),
    defineField({
      name: "darkTextSecondary",
      title: "Dark Mode — Text Secondary",
      type: "color",
      group: "themeColors",
      options: { disableAlpha: true },
    }),

    /* ═══ SEO ═══ */
    defineField({
      name: "metaDescription_en",
      title: "Meta Description (English)",
      type: "text",
      rows: 2,
      group: "seo",
    }),
    defineField({
      name: "metaDescription_ar",
      title: "Meta Description (Arabic)",
      type: "text",
      rows: 2,
      group: "seo",
    }),

    /* ═══ SOCIAL ═══ */
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
      group: "social",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "platform",
              title: "Platform Name",
              type: "string", // بقت خانة كتابة عادية دلوقتي
              description: "اكتب اسم المنصة هنا (مثلاً: Facebook, TikTok, إلخ)",
            },
            { name: "url", title: "URL", type: "url" },
            /* --- حقل رفع الأيقونة --- */
            defineField({
              name: "iconImage",
              title: "Custom Icon",
              type: "image",
              options: { hotspot: true },
              description: "ارفع أيقونة المنصة هنا (يفضل SVG أو PNG مفرغة)",
            }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "⚙️ Site Settings" };
    },
  },
});