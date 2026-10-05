import { defineField, defineType } from "sanity";

export const project = defineType({
  name: "project",
  title: "💼 Project",
  type: "document",
  fields: [
    defineField({ 
      name: "title", 
      title: "Title (Internal)", 
      type: "string",
      description: "اسم المشروع الداخلي ليك في لوحة التحكم (مثال: مشروع تصميم تطبيق مطعم)."
    }),
    defineField({ 
      name: "title_en", 
      title: "Title (EN)", 
      type: "string",
      description: "عنوان المشروع بالإنجليزي اللي هيظهر للعميل (مثال: Restaurant App UI/UX)."
    }),
    defineField({ 
      name: "title_ar", 
      title: "Title (AR)", 
      type: "string",
      description: "عنوان المشروع بالعربي (مثال: تصميم واجهة تطبيق مطعم)."
    }),
    defineField({ 
      name: "slug", 
      title: "Slug", 
      type: "slug", 
      options: { source: "title" },
      description: "الرابط بتاع المشروع (اضغط Generate عشان يعمله لوحده)."
    }),
    defineField({ 
      name: "category", 
      title: "Category (Value)", 
      type: "string",
      description: "اكتب هنا كود القسم للربط الذكي (مثال: graphic-design أو social-media)."
    }),
    defineField({ 
      name: "date", 
      title: "Date", 
      type: "date",
      description: "تاريخ المشروع (عشان يتعرض السنة بتاعته أو يترتب بيه)."
    }),
    defineField({ 
      name: "thumbnail", 
      title: "Thumbnail", 
      type: "image",
      description: "صورة الغلاف الأساسية اللي هتظهر في شبكة المشاريع برة."
    }),
    defineField({ 
      name: "hoverType", 
      title: "Hover Type", 
      type: "string", 
      options: { list: ["none", "slider", "video"] },
      description: "إيه اللي يحصل لما العميل يقف بالماوس على الصورة من برة؟ (بدون، أو سلايدر صور، أو فيديو)."
    }),
    defineField({ 
      name: "galleryImages", 
      title: "Hover Gallery (Images)", 
      type: "array", 
      of: [{ type: "image" }],
      description: "لو اخترت Hover Type يكون slider، ارفع هنا الصور اللي هتقلب ورا بعض."
    }),
    defineField({ 
      name: "hoverVideo", 
      title: "Hover Video", 
      type: "file",
      description: "لو اخترت Hover Type يكون video، ارفع فيديو قصير بصيغة MP4 يشتغل أوتوماتيك."
    }),
    defineField({ 
      name: "tools", 
      title: "Tools Used", 
      type: "array", 
      of: [
        { 
          type: "object", 
          fields: [
            { name: "name", type: "string", description: "اسم الأداة (مثال: Figma, Photoshop)" }, 
            { name: "icon", type: "image", description: "أيقونة الأداة (يفضل بصيغة PNG أو SVG)" }
          ] 
        }
      ],
      description: "البرامج والأدوات اللي استخدمتها في المشروع ده."
    }),
    defineField({ 
      name: "description_en", 
      title: "Description (EN)", 
      type: "text",
      description: "وصف قصير للمشروع بالإنجليزي هيظهر تحت العنوان."
    }),
    defineField({ 
      name: "description_ar", 
      title: "Description (AR)", 
      type: "text",
      description: "وصف قصير للمشروع بالعربي هيظهر تحت العنوان."
    }),
    defineField({ 
      name: "caseStudy_en", 
      title: "Case Study (EN)", 
      type: "array", 
      of: [{ type: "block" }, { type: "image" }],
      description: "اكتب هنا تفاصيل دراسة الحالة كاملة براحتك وضيف صور وسط الكلام (بالإنجليزي)."
    }),
    defineField({ 
      name: "caseStudy_ar", 
      title: "Case Study (AR)", 
      type: "array", 
      of: [{ type: "block" }, { type: "image" }],
      description: "اكتب هنا تفاصيل دراسة الحالة كاملة براحتك وضيف صور وسط الكلام (بالعربي)."
    }),
    defineField({ 
      name: "detailsLayout", 
      title: "Media Gallery Layout", 
      type: "string", 
      options: { list: ["grid", "column"] },
      description: "شكل عرض الصور جوه المشروع (Grid: عمودين جمب بعض، Column: صور كبيرة تحت بعض)."
    }),
    defineField({ 
      name: "mediaGallery", 
      title: "Full Media Gallery", 
      type: "array", 
      of: [
        { type: "image" }, 
        { type: "object", name: "videoElement", fields: [{ name: "url", type: "url", description: "لينك اليوتيوب أو فيميو" }] }
      ],
      description: "معرض الصور والفيديوهات الأساسي جوه صفحة المشروع."
    }),

    // 👇 الإضافات الجديدة بأمثلة واضحة 👇
    defineField({
      name: "liveLink",
      title: "Live Project Link",
      type: "url",
      description: "اللينك المباشر لو الموقع شغال لايف. (مثال: https://www.your-client.com)",
    }),
    defineField({
      name: "embedCode",
      title: "Embed Code (Figma, etc.)",
      type: "text",
      rows: 4,
      description: "كود التضمين (iframe) عشان تعرض التصميم شغال لايف من فيجما. (مثال: <iframe style='border: 1px solid rgba(0, 0, 0, 0.1);' width='800' height='450' src='https://www.figma.com/embed?embed_host=share&url=...'></iframe>)",
    }),
    defineField({
      name: "projectPdf",
      title: "Project PDF (Optional)",
      type: "file",
      options: { accept: "application/pdf" },
      description: "ارفع هنا ملف PDF (زي عرض تقديمي أو دراسة حالة). لو رفعته، هيظهر زرار 'عرض الملف' في آخر المشروع تلقائياً.",
    }),
  ],
});