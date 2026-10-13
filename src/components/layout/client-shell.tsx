"use client";

import React from "react";
import dynamic from "next/dynamic";
import WhatsAppButton from "@/components/ui/whatsapp-button";

const CustomCursor = dynamic(() => import("@/components/animations/custom-cursor"), { ssr: false });
const SmoothScrollProvider = dynamic(() => import("@/components/animations/smooth-scroll-provider"), { ssr: false });

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      {children}
      <WhatsAppButton />
    </SmoothScrollProvider>
  );
}
