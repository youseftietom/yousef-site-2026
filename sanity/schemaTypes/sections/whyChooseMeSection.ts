import { defineField, defineType } from "sanity";

export const whyChooseMeSection = defineType({
  name: "whyChooseMeSection",
  title: "✨ Why Choose Me Section",
  type: "object",
  fields: [
    defineField({
      name: "heading_en",
      title: "Heading (English)",
      type: "string",
      initialValue: "Why Work With Me?",
      description: "عنوان قسم لماذا تختارني بالإنجليزي.",
    }),
    defineField({
      name: "heading_ar",
      title: "Heading (Arabic)",
      type: "string",
      initialValue: "لماذا تختارني؟",
      description: "عنوان قسم لماذا تختارني بالعربي.",
    }),
    defineField({
      name: "subtitle_en",
      title: "Subtitle (English)",
      type: "string",
      initialValue:
        "The advantages that make every collaboration a success story",
      description: "وصف القسم بالإنجليزي.",
    }),
    defineField({
      name: "subtitle_ar",
      title: "Subtitle (Arabic)",
      type: "string",
      initialValue: "المزايا التي تجعل كل تعاون قصة نجاح",
      description: "وصف القسم بالعربي.",
    }),
    defineField({
      name: "featuresList",
      title: "Features List (قائمة الميزات)",
      type: "array",
      of: [
        {
          type: "object",
          name: "featureItem",
          fields: [
            defineField({
              name: "icon",
              title: "Icon (أيقونة)",
              type: "string",
              options: {
                list: [
                  { title: "⚡ Zap (سرعة التسليم)", value: "zap" },
                  { title: "🎯 Target (دقة التنفيذ)", value: "target" },
                  { title: "💎 Gem (جودة عالية)", value: "gem" },
                  { title: "🔥 Flame (شغف إبداعي)", value: "flame" },
                  { title: "🏆 Trophy (احترافية)", value: "trophy" },
                  { title: "💬 MessageCircle (تواصل سهل)", value: "message-circle" },
                  { title: "🎨 Palette (إبداع في التصميم)", value: "palette" },
                  { title: "🔄 RefreshCw (مراجعات مرنة)", value: "refresh-cw" },
                  { title: "🛡️ Shield (أمان وموثوقية)", value: "shield" },
                  { title: "📊 BarChart (نتائج قابلة للقياس)", value: "bar-chart" },
                  { title: "✨ Sparkles (تفاصيل استثنائية)", value: "sparkles" },
                  { title: "🤝 Handshake (شراكة حقيقية)", value: "handshake" },
                  { title: "📱 Smartphone (توافق متعدد المنصات)", value: "smartphone" },
                  { title: "🖥️ Monitor (تصميم UI/UX)", value: "monitor" },
                  { title: "🎬 Film (إنتاج فيديو)", value: "film" },
                  { title: "🕐 Clock (التزام بالمواعيد)", value: "clock" },
                ],
              },
              initialValue: "gem",
              description: "اختر الأيقونة المناسبة للميزة.",
            }),
            defineField({
              name: "title_en",
              title: "Title (English)",
              type: "string",
              description: "عنوان الميزة بالإنجليزي.",
            }),
            defineField({
              name: "title_ar",
              title: "Title (Arabic)",
              type: "string",
              description: "عنوان الميزة بالعربي.",
            }),
            defineField({
              name: "description_en",
              title: "Description (English)",
              type: "text",
              rows: 3,
              description: "وصف مختصر للميزة بالإنجليزي.",
            }),
            defineField({
              name: "description_ar",
              title: "Description (Arabic)",
              type: "text",
              rows: 3,
              description: "وصف مختصر للميزة بالعربي.",
            }),
          ],
          preview: {
            select: {
              title: "title_en",
              subtitle: "description_en",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "✨ Why Choose Me Section" };
    },
  },
});
