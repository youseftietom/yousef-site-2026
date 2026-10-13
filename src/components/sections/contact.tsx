"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import TextReveal from "@/components/animations/text-reveal";
import MagneticButton from "@/components/animations/magnetic-button";

// التعديل: حطينا رقمك بالكود الدولي لمصر (20+) عشان الواتساب يشتغل صح
const WHATSAPP_NUMBER = "201551599940";

const schema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  service: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Contact({ data }: { data?: any }) {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [sent, setSent] = useState(false);

  const heading = (locale === "ar" ? data?.heading_ar : data?.heading_en) || t("title");
  const subtitle = (locale === "ar" ? data?.subtitle_ar : data?.subtitle_en) || t("subtitle");
  const showServiceDropdown = data?.showServiceDropdown ?? true;
  
  // بياخد الرقم من السانتي لو موجود، لو مش موجود بياخد الرقم بتاعك اللي فوق
  const currentWhatsappNumber = data?.whatsappOverride || WHATSAPP_NUMBER;

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (formData: FormData) => {
    // رسالة الواتساب متنسقة جاهزة
    const text = `*New Project Inquiry*%0A%0A*Name:* ${formData.name}%0A*Email:* ${formData.email}${showServiceDropdown ? `%0A*Service:* ${formData.service}` : ''}%0A*Message:* ${formData.message}`;
    const url = `https://wa.me/${currentWhatsappNumber}?text=${text}`;
    window.open(url, "_blank");
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  const services = [
    { value: "graphic-design", label: t("serviceGraphic") },
    { value: "video-editing", label: t("serviceVideo") },
    { value: "ui-ux", label: t("serviceUiux") },
    { value: "motion-graphics", label: t("serviceMotion") },
    { value: "other", label: t("serviceOther") },
  ];

  const inputBase = "w-full px-5 py-4 rounded-xl bg-surface border border-border text-text-primary placeholder:text-text-muted text-sm transition-all duration-300 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary outline-none";

  return (
    <section id="contact" className="section-spacing relative">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-16 text-center">
          <TextReveal as="h2" className="font-heading text-4xl md:text-6xl font-bold text-text-primary justify-center">
            {heading}
          </TextReveal>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="text-text-secondary text-lg mt-4 max-w-lg mx-auto">
            {subtitle}
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
          <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-8 md:p-12 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input {...register("name")} placeholder={t("name")} className={inputBase} />
                {errors.name && <p className="text-red-500 text-xs mt-1">{t(errors.name.message as string)}</p>}
              </div>
              <div>
                <input {...register("email")} type="email" placeholder={t("email")} className={inputBase} />
                {errors.email && <p className="text-red-500 text-xs mt-1">{t(errors.email.message as string)}</p>}
              </div>
            </div>

            {showServiceDropdown && (
              <div>
                <select {...register("service")} className={`${inputBase} appearance-none cursor-pointer`} defaultValue="">
                  <option value="" disabled>{t("servicePlaceholder")}</option>
                  {services.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
                {errors.service && <p className="text-red-500 text-xs mt-1">{t(errors.service.message as string)}</p>}
              </div>
            )}

            <div>
              <textarea {...register("message")} rows={5} placeholder={t("messagePlaceholder")} className={`${inputBase} resize-none`} />
              {errors.message && <p className="text-red-500 text-xs mt-1">{t(errors.message.message as string)}</p>}
            </div>

            <div className="flex justify-center pt-4">
              <MagneticButton 
                as="button" 
                type="submit" 
                strength={0.3}
                className={`inline-flex items-center gap-[10px] px-[36px] py-[14px] rounded-full text-white font-semibold text-base border-none cursor-pointer shadow-[0_4px_20px_rgba(37,211,102,0.35)] transition-all duration-300 ${sent ? "bg-[#128C7E]" : "bg-[#25D366]"}`}
              >
                {sent ? (
                  <><CheckCircle size={20} /> <span>{t("successTitle") || "Sent!"}</span></>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="20" height="20" fill="currentColor" aria-hidden="true">
                      <path d="M16.002 2C8.28 2 2 8.28 2 16.002c0 2.478.65 4.907 1.885 7.045L2 30l7.183-1.858A13.94 13.94 0 0 0 16.002 30C23.72 30 30 23.72 30 16.002 30 8.28 23.72 2 16.002 2zm0 25.6a11.54 11.54 0 0 1-5.88-1.607l-.422-.25-4.266 1.103 1.13-4.144-.276-.437A11.555 11.555 0 0 1 4.4 16.002C4.4 9.608 9.608 4.4 16.002 4.4S27.6 9.608 27.6 16.002 22.394 27.6 16.002 27.6zm6.34-8.653c-.347-.174-2.055-1.014-2.375-1.13-.32-.116-.553-.173-.786.174-.232.347-.9 1.13-1.103 1.363-.203.232-.405.26-.752.087-.347-.174-1.465-.54-2.79-1.72-1.032-.92-1.727-2.055-1.93-2.402-.202-.347-.022-.535.152-.708.157-.155.347-.405.52-.608.175-.202.232-.347.348-.578.116-.232.058-.434-.029-.608-.087-.174-.786-1.893-1.076-2.593-.284-.68-.573-.588-.786-.598l-.668-.012c-.232 0-.608.087-.927.434-.318.347-1.218 1.189-1.218 2.9s1.247 3.364 1.42 3.597c.174.232 2.454 3.747 5.946 5.255.831.358 1.48.572 1.986.732.834.265 1.594.228 2.194.138.669-.1 2.055-.84 2.344-1.652.29-.811.29-1.507.203-1.652-.086-.145-.318-.232-.665-.406z"/>
                    </svg>
                    <span>{t("send") || "Send via WhatsApp"}</span>
                  </>
                )}
              </MagneticButton>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}