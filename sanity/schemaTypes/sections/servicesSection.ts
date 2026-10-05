import { defineField, defineType } from "sanity";

export const servicesSection = defineType({
  name: "servicesSection",
  title: "🛎️ Services Section",
  type: "object",
  fields: [
    defineField({
      name: "heading_en",
      title: "Heading (English)",
      type: "string",
      initialValue: "Services",
      description: "عنوان قسم الخدمات بالإنجليزي.",
    }),
    defineField({
      name: "heading_ar",
      title: "Heading (Arabic)",
      type: "string",
      initialValue: "الخدمات المقدمة",
      description: "عنوان قسم الخدمات بالعربي.",
    }),
    defineField({
      name: "subtitle_en",
      title: "Subtitle (English)",
      type: "string",
      initialValue: "Professional creative services tailored to your needs",
      description: "وصف قسم الخدمات بالإنجليزي.",
    }),
    defineField({
      name: "subtitle_ar",
      title: "Subtitle (Arabic)",
      type: "string",
      initialValue: "خدمات إبداعية احترافية مصممة لتلبية احتياجاتك",
      description: "وصف قسم الخدمات بالعربي.",
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp Number (رقم الواتساب)",
      type: "string",
      description:
        "اكتب رقم الواتس الخاص بيك بكود الدولة بدون + أو أصفار. مثال لمصر: 201012345678. لو سبته فاضي هيستخدم الرقم من إعدادات الموقع.",
    }),
    defineField({
      name: "services",
      title: "Services List",
      type: "array",
      of: [
        {
          type: "object",
          name: "serviceItem",
          fields: [
            defineField({
              name: "title_en",
              title: "Service Name (EN)",
              type: "string",
            }),
            defineField({
              name: "title_ar",
              title: "Service Name (AR)",
              type: "string",
            }),
            defineField({
              name: "description_en",
              title: "Description (EN)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "description_ar",
              title: "Description (AR)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "icon",
              title: "Icon (أيقونة جاهزة)",
              type: "string",
              options: {
                list: [
                  { title: "🎬 Video (فيديو/ريلز)", value: "video" },
                  { title: "🎨 Palette (تصميم جرافيك)", value: "palette" },
                  { title: "🖥️ Monitor (UI/UX)", value: "monitor" },
                  { title: "🎞️ Film (موشن جرافيك)", value: "film" },
                  { title: "📱 Smartphone (سوشيال ميديا)", value: "smartphone" },
                  { title: "✏️ PenTool (تصميم)", value: "pen-tool" },
                  { title: "📷 Camera (تصوير)", value: "camera" },
                  { title: "🖼️ Layout (تصميم مواقع)", value: "layout" },
                  { title: "🎯 Target (استراتيجية)", value: "target" },
                  { title: "⚡ Zap (سريع)", value: "zap" },
                  { title: "💎 Gem (بريميوم)", value: "gem" },
                  { title: "🔥 Flame (ترندي)", value: "flame" },
                  { title: "📊 Presentation (عروض وتقارير)", value: "presentation" },
                ],
              },
              initialValue: "palette",
              description: "اختار أيقونة من هنا، أو سيبها لو هترفع أيقونات مخصصة تحت.",
            }),
            // 👇 التعديل هنا: حقل للايت وحقل للدارك 👇
            defineField({
              name: "customIconLight",
              title: "Custom Icon (Light Mode)",
              type: "image",
              options: { accept: "image/*" },
              description: "أيقونة الوضع الفاتح (اللايت مود).",
            }),
            defineField({
              name: "customIconDark",
              title: "Custom Icon (Dark Mode)",
              type: "image",
              options: { accept: "image/*" },
              description: "أيقونة الوضع المظلم (الدارك مود).",
            }),
            defineField({
              name: "category",
              title: "Portfolio Category (للربط الذكي)",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "title_en", subtitle: "category", media: "customIconLight" },
          },
        },
      ],
    }),
    defineField({
      name: "showContactBanner",
      title: "Show Contact Banner (إظهار بانر التواصل)",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return { title: "🛎️ Services Section" };
    },
  },
});