import { defineField, defineType } from "sanity";

export const experienceSection = defineType({
  name: "experienceSection",
  title: "💼 Experience Section",
  type: "object",
  fields: [
    defineField({ name: "heading_en", title: "Heading (English)", type: "string", initialValue: "Experience & Skills", description: "عنوان القسم بالإنجليزي. مثال: Experience" }),
    defineField({ name: "heading_ar", title: "Heading (Arabic)", type: "string", initialValue: "الخبرات والمهارات", description: "عنوان القسم بالعربي. مثال: مسيرتي المهنية" }),
    defineField({ name: "showTechStack", title: "Show Tech Stack Badges", type: "boolean", initialValue: true, description: "إظهار أو إخفاء أسماء التقنيات اللي اشتغلت بيها جوه كل وظيفة." }),
    defineField({ name: "showTimeline", title: "Show Timeline", type: "boolean", initialValue: true, description: "إظهار أو إخفاء خط الزمن اللي بيربط الوظائف ببعض." }),
    // زرار التحكم في اللوجو
    defineField({ name: "showCompanyLogo", title: "Show Company Logos", type: "boolean", initialValue: true, description: "إظهار أو إخفاء لوجوهات الشركات من كل الكروت." }),

    defineField({
      name: "jobs",
      title: "Work Experience 🚀",
      description: "ضيف وظايفك وخبراتك من هنا (اضغط على Add Item عشان تضيف وظيفة جديدة)",
      type: "array",
      of: [
        {
          type: "object",
          title: "Job / Experience",
          fields: [
            defineField({ name: "role_en", title: "Role (English)", type: "string", description: "المسمى الوظيفي بالإنجليزي. مثال: Graphic Designer" }),
            defineField({ name: "role_ar", title: "Role (Arabic)", type: "string", description: "المسمى الوظيفي بالعربي. مثال: مصمم جرافيك" }),
            defineField({ name: "company_en", title: "Company Name (English)", type: "string", description: "اسم الشركة بالإنجليزي" }),
            defineField({ name: "company_ar", title: "Company Name (Arabic)", type: "string", description: "اسم الشركة بالعربي" }),
            
            // حقل رفع اللوجو للشركة
            defineField({ 
              name: "companyLogo", 
              title: "Company Logo", 
              type: "image", 
              options: { hotspot: true },
              description: "لوجو الشركة (اختياري - هيظهر فوق على اليمين جوه الكارت)" 
            }),

            defineField({ name: "duration_en", title: "Duration (English)", type: "string", description: "مدة العمل بالإنجليزي. مثال: 2021 — 2022 أو 2023 - Present" }),
            defineField({ name: "duration_ar", title: "Duration (Arabic)", type: "string", description: "مدة العمل بالعربي. مثال: 2021 — 2022 أو 2023 - حتى الآن" }),
            defineField({ name: "description_en", title: "Description (English)", type: "text", description: "وصف اللي عملته في الوظيفة بالإنجليزي (تقدر تكتب كذا سطر)" }),
            defineField({ name: "description_ar", title: "Description (Arabic)", type: "text", description: "وصف اللي عملته في الوظيفة بالعربي" }),
            defineField({
              name: "techStack",
              title: "Technologies Used",
              type: "array",
              of: [{ type: "string" }],
              options: { layout: "tags" },
              description: "اكتب اسم التقنية واضغط Enter عشان تتحول لـ Tag (مثال: Photoshop, Illustrator)"
            })
          ],
          preview: {
            select: { title: 'role_en', subtitle: 'company_en', media: 'companyLogo' }
          }
        }
      ]
    })
  ],
  preview: { prepare() { return { title: "💼 Experience Section" }; } },
});