import { defineField, defineType } from "sanity";

export const brandsSection = defineType({
  name: "brandsSection",
  title: "🏢 Brands Marquee",
  type: "object",
  fields: [
    // زرار التحكم في العنوان
    defineField({
      name: "showHeading",
      title: "Show Heading (إظهار العنوان)",
      type: "boolean",
      initialValue: false, // مقفول افتراضياً زي ما طلبت
      description: "لو قفلت الزرار ده، العنوان هيختفي خالص والمساحة هتبقى للوجوهات بس."
    }),

    // حقول العناوين (بتختفي من الداش بورد لو قفلت الزرار عشان الزحمة)
    defineField({
      name: "heading_en",
      title: "Heading (English)",
      type: "string",
      initialValue: "Trusted By",
      hidden: ({ parent }) => !parent?.showHeading,
    }),
    defineField({
      name: "heading_ar",
      title: "Heading (Arabic)",
      type: "string",
      initialValue: "شركاء النجاح",
      hidden: ({ parent }) => !parent?.showHeading,
    }),
    
    // زرار التحكم في الحركة
    defineField({
      name: "enableAnimation",
      title: "Enable Animation (تشغيل الحركة)",
      type: "boolean",
      initialValue: true,
      description: "لو قفلت الزرار ده، الحركة هتقف واللوجوهات هتبقى ثابتة في نص الشاشة."
    }),

    defineField({
      name: "logos",
      title: "Brand Logos (اللوجوهات)",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "image", title: "Logo Image", type: "image", options: { hotspot: true } },
            { name: "name", title: "Brand Name", type: "string" }
          ],
          preview: { select: { title: 'name', media: 'image' } }
        }
      ]
    }),

    defineField({
      name: "speed",
      title: "Animation Speed (السرعة)",
      type: "number",
      initialValue: 30,
      hidden: ({ parent }) => !parent?.enableAnimation,
    }),

    defineField({
      name: "direction",
      title: "Direction (الاتجاه)",
      type: "string",
      options: {
        list: [
          { title: "Left to Right", value: "left" },
          { title: "Right to Left", value: "right" }
        ],
        layout: "radio"
      },
      initialValue: "left",
      hidden: ({ parent }) => !parent?.enableAnimation,
    })
  ],
  preview: { prepare() { return { title: "🏢 Brands Marquee" }; } },
});