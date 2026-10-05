import { defineField, defineType } from "sanity";

export const statsSection = defineType({
  name: "statsSection",
  title: "📊 Stats Section",
  type: "object",
  fields: [
    defineField({
      name: "heading_en",
      title: "Heading (English)",
      type: "string",
      initialValue: "Numbers That Speak",
      description: "عنوان قسم الإحصائيات بالإنجليزي.",
    }),
    defineField({
      name: "heading_ar",
      title: "Heading (Arabic)",
      type: "string",
      initialValue: "أرقام تتحدث عن نفسها",
      description: "عنوان قسم الإحصائيات بالعربي.",
    }),
    defineField({
      name: "subtitle_en",
      title: "Subtitle (English)",
      type: "string",
      initialValue: "Milestones & achievements across my creative journey",
      description: "وصف قسم الإحصائيات بالإنجليزي.",
    }),
    defineField({
      name: "subtitle_ar",
      title: "Subtitle (Arabic)",
      type: "string",
      initialValue: "محطات وإنجازات على مدار رحلتي الإبداعية",
      description: "وصف قسم الإحصائيات بالعربي.",
    }),
    defineField({
      name: "statsList",
      title: "Stats List (قائمة الإحصائيات)",
      type: "array",
      of: [
        {
          type: "object",
          name: "statItem",
          fields: [
            defineField({
              name: "value",
              title: "Value (القيمة)",
              type: "string",
              description:
                'الرقم أو القيمة المعروضة. مثال: "+50" أو "100%" أو "3K+".',
            }),
            defineField({
              name: "label_en",
              title: "Label (English)",
              type: "string",
              description: "وصف الإحصائية بالإنجليزي. مثال: Projects Completed",
            }),
            defineField({
              name: "label_ar",
              title: "Label (Arabic)",
              type: "string",
              description: "وصف الإحصائية بالعربي. مثال: مشروع منجز",
            }),
          ],
          preview: {
            select: {
              title: "value",
              subtitle: "label_en",
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "📊 Stats Section" };
    },
  },
});
