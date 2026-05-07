"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({ locale, text }: { locale: string, text: string }) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    // هيروح للرئيسية وينزل لسكشن المشاريع
    router.push(`/${locale}/#projects`);
  };

  return (
    <button 
      onClick={handleBack}
      className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-medium"
    >
      <ArrowLeft size={16} className={locale === "ar" ? "rotate-180" : ""} /> 
      {text}
    </button>
  );
}