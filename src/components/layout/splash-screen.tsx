"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  // true من الأول = يظهر فوراً عند كل تحميل جديد للصفحة (refresh)
  // لما تتنقل بـ router.push الـ layout مش بيتحمل من جديد فالـ state تفضل زي ما هي
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#FAFAFA] dark:bg-[#0F0E0E]"
        >
          <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
            
            {/* الاسبلاش بتاع اللايت مود */}
            <Image
              src="/splash-light.gif" 
              alt="Loading..."
              fill
              className="object-contain dark:hidden"
              priority
              unoptimized 
            />

            {/* الاسبلاش بتاع الدارك مود */}
            <Image
              src="/splash-dark.gif" 
              alt="Loading..."
              fill
              className="object-contain hidden dark:block"
              priority
              unoptimized 
            />
            
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}