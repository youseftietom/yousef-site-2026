import { defineField, defineType } from "sanity";

export const pricingSection = defineType({
  name: "pricingSection",
  title: "💰 Pricing Section",
  type: "object",
  fields: [
    defineField({ name: "heading_en", title: "Heading (English)", type: "string", initialValue: "Pricing", description: "عنوان قسم الأسعار بالإنجليزي." }),
    defineField({ name: "heading_ar", title: "Heading (Arabic)", type: "string", initialValue: "الأسعار", description: "عنوان قسم الأسعار بالعربي." }),
    defineField({ name: "subtitle_en", title: "Subtitle (English)", type: "string", description: "وصف القسم بالإنجليزي." }),
    defineField({ name: "subtitle_ar", title: "Subtitle (Arabic)", type: "string", description: "وصف القسم بالعربي." }),
    
    // الباقات الأساسية (ملمسناهاش)
    defineField({
      name: "plans", title: "Pricing Plans", type: "array", description: "ضيف باقات أسعارك هنا.",
      of: [{
        type: "object", name: "plan", fields: [
          defineField({ name: "name_en", title: "Plan Name (EN)", type: "string", description: "اسم الباقة بالإنجليزي. مثال: Pro Plan" }),
          defineField({ name: "name_ar", title: "Plan Name (AR)", type: "string", description: "اسم الباقة بالعربي. مثال: الباقة الاحترافية" }),
          defineField({ name: "price", title: "Display Price (Text)", type: "string", description: "النص اللي هيظهر (مثال: Custom أو $499)" }),
          defineField({ name: "numericPrice", title: "Numeric Price (للحسبة)", type: "number", description: "اكتب الرقم فقط هنا (مثلاً: 1200) عشان السيستم يحوله تلقائي." }),
          defineField({ name: "period_en", title: "Period (EN)", type: "string", description: "المدة بالإنجليزي. مثال: per month أو per project" }),
          defineField({ name: "period_ar", title: "Period (AR)", type: "string", description: "المدة بالعربي. مثال: شهرياً أو لكل مشروع" }),
          defineField({ name: "description_en", title: "Description (EN)", type: "text", rows: 2, description: "وصف الباقة بالإنجليزي." }),
          defineField({ name: "description_ar", title: "Description (AR)", type: "text", rows: 2, description: "وصف الباقة بالعربي." }),
          defineField({
            name: "features", title: "Features", type: "array", description: "مميزات الباقة.",
            of: [{
              type: "object", fields: [
                defineField({ name: "text_en", title: "Feature (EN)", type: "string" }),
                defineField({ name: "text_ar", title: "Feature (AR)", type: "string" }),
                defineField({ name: "included", title: "Included", type: "boolean", initialValue: true }),
              ]
            }]
          }),
          defineField({ name: "highlighted", title: "Highlight (Most Popular)", type: "boolean", initialValue: false }),
          defineField({ name: "ctaText_en", title: "CTA Text (EN)", type: "string", initialValue: "Get Started" }),
          defineField({ name: "ctaText_ar", title: "CTA Text (AR)", type: "string", initialValue: "ابدأ الآن" }),
          defineField({ name: "ctaLink", title: "CTA Link", type: "string", initialValue: "#contact" }),
        ], preview: { select: { title: "name_en", subtitle: "price" } }
      }]
    }),

    // 🔴 الخيار الأول: قسم الخدمات الفردية بأسعارها (A la carte)
    defineField({
      name: "showAlaCarte", 
      title: "Show Individual Services (إظهار الخدمات الفردية)", 
      type: "boolean", 
      initialValue: false,
      description: "زرار تفعيل/إخفاء قسم الخدمات الفردية بالكامل من الموقع."
    }),
    defineField({ 
      name: "alaCarteHeading_en", 
      title: "Individual Services Heading (EN)", 
      type: "string", 
      initialValue: "A la Carte Services",
      description: "عنوان قسم الخدمات الفردية بالإنجليزي (بيظهر فوق جدول الخدمات)."
    }),
    defineField({ 
      name: "alaCarteHeading_ar", 
      title: "عنوان الخدمات الفردية (AR)", 
      type: "string", 
      initialValue: "خدمات فردية بأسعار مخصصة",
      description: "عنوان قسم الخدمات الفردية بالعربي (بيظهر فوق جدول الخدمات)."
    }),
    defineField({
      name: "alaCarteServices", 
      title: "Individual Services List", 
      type: "array", 
      description: "اضغط Add item عشان تضيف الخدمات الفردية (مثال: تصميم لوجو، تعديل فيديو دقيقة) مع تسعيرها الذكي.",
      of: [{
        type: "object", fields: [
          defineField({ name: "name_en", title: "Service Name (EN)", type: "string", description: "اسم الخدمة بالإنجليزي. مثال: Logo Design" }),
          defineField({ name: "name_ar", title: "Service Name (AR)", type: "string", description: "اسم الخدمة بالعربي. مثال: تصميم لوجو احترافي" }),
          defineField({ name: "price", title: "Fallback Price (Text)", type: "string", description: "السعر كـ نص بيظهر لو السيستم محسبش العملة تلقائي. مثال: $50" }),
          defineField({ name: "numericPrice", title: "Numeric Price (للحسبة الذكية)", type: "number", description: "اكتب رقم السعر الصافي فقط بدون أي رموز (مثال: 50)، وعشان السيستم يقلب العملة أوتوماتيك حسب دولة الزائر." }),
        ], preview: { select: { title: "name_en", subtitle: "price" } }
      }]
    }),

    // 🔴 الخيار الثاني: بانر الواتساب المباشر
    defineField({
      name: "showWhatsappBanner", 
      title: "Show WhatsApp Banner (إظهار بانر الواتساب)", 
      type: "boolean", 
      initialValue: true,
      description: "زرار تفعيل/إخفاء بانر التواصل السريع عبر الواتساب تحت قسم الأسعار."
    }),
    defineField({ 
      name: "whatsappHeading_en", 
      title: "WhatsApp Heading (EN)", 
      type: "string", 
      initialValue: "Need a specific design?",
      description: "عنوان بانر الواتساب بالإنجليزي."
    }),
    defineField({ 
      name: "whatsappHeading_ar", 
      title: "عنوان بانر الواتساب (AR)", 
      type: "string", 
      initialValue: "لطلب تصميمات فردية مخصصة",
      description: "عنوان بانر الواتساب بالعربي."
    }),
    defineField({ 
      name: "whatsappDesc_en", 
      title: "WhatsApp Desc (EN)", 
      type: "text", 
      rows: 2, 
      initialValue: "Contact me directly to discuss your custom project.",
      description: "الوصف الجانبي لبانر الواتساب بالإنجليزي."
    }),
    defineField({ 
      name: "whatsappDesc_ar", 
      title: "وصف بانر الواتساب (AR)", 
      type: "text", 
      rows: 2, 
      initialValue: "مش محتاج باقة؟ تقدر تطلب تصميم واحد بس. تواصل معايا على الواتساب ونتفق.",
      description: "الوصف الجانبي لبانر الواتساب بالعربي."
    }),
    defineField({ 
      name: "whatsappBtn_en", 
      title: "WhatsApp Button Text (EN)", 
      type: "string", 
      initialValue: "Chat on WhatsApp",
      description: "الكلام اللي هيتكتب جوة زرار الواتساب بالإنجليزي."
    }),
    defineField({ 
      name: "whatsappBtn_ar", 
      title: "نص زرار الواتساب (AR)", 
      type: "string", 
      initialValue: "تواصل عبر الواتساب",
      description: "الكلام اللي هيتكتب جوة زرار الواتساب بالعربي."
    }),
    defineField({ 
      name: "whatsappNumber", 
      title: "WhatsApp Number (رقم الواتساب)", 
      type: "string", 
      description: "اكتب رقم الواتس الخاص بيك مضافاً إليه كود الدولة بدون علامة + أو أصفار في الأول. مثال لمصر: 201012345678" 
    }),
  ],
  preview: { prepare() { return { title: "💰 Pricing Section" }; } },
});