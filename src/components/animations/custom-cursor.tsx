"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CursorState {
  text: string;
  isHovering: boolean;
  isHidden: boolean;
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>({
    text: "",
    isHovering: false,
    isHidden: false,
  });
  const [enabled, setEnabled] = useState(false);

  const posRef = useRef({ x: 0, y: 0 });
  const targetRef = useRef({ x: 0, y: 0 });
  // لو الماوس واقف، وقف الـ RAF loop
  const isMovingRef = useRef(false);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animIdRef = useRef<number>(0);

  useEffect(() => {
    // بس على الأجهزة اللي فيها ماوس حقيقي
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (!hasFinePointer || isTouch) return;
    setEnabled(true);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    targetRef.current = { x: e.clientX, y: e.clientY };

    // ابدأ الـ loop بس لو مش شغال
    if (!isMovingRef.current) {
      isMovingRef.current = true;
      startLoop();
    }

    // وقفه بعد 150ms من آخر حركة
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      isMovingRef.current = false;
    }, 150);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startLoop = useCallback(() => {
    const animate = () => {
      if (!isMovingRef.current) return; // وقف لو مفيش حركة

      const lerp = 0.15;
      posRef.current.x += (targetRef.current.x - posRef.current.x) * lerp;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * lerp;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate3d(${targetRef.current.x}px, ${targetRef.current.y}px, 0)`;
      }

      animIdRef.current = requestAnimationFrame(animate);
    };
    animIdRef.current = requestAnimationFrame(animate);
  }, []);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const cursorAttr = target.closest("[data-cursor]");

    if (cursorAttr) {
      const text = cursorAttr.getAttribute("data-cursor") || "";
      setState((prev) => (prev.text === text && prev.isHovering ? prev : { ...prev, text, isHovering: true }));
    } else if (
      target.closest("a") ||
      target.closest("button") ||
      target.closest("[role='button']")
    ) {
      setState((prev) => (prev.text === "" && prev.isHovering ? prev : { ...prev, text: "", isHovering: true }));
    } else {
      setState((prev) => (!prev.isHovering ? prev : { ...prev, text: "", isHovering: false }));
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setState((prev) => (prev.isHidden ? prev : { ...prev, isHidden: true }));
  }, []);

  const handleMouseEnter = useCallback(() => {
    setState((prev) => (!prev.isHidden ? prev : { ...prev, isHidden: false }));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animIdRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [enabled, handleMouseMove, handleMouseOver, handleMouseLeave, handleMouseEnter]);

  if (!enabled) return null;

  return (
    <>
      {/* Dot (no lag) */}
      <div
        ref={cursorDotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10001]"
        style={{ willChange: "transform" }}
      >
        <motion.div
          className="rounded-full bg-primary"
          animate={{
            width: state.isHovering ? 0 : 6,
            height: state.isHovering ? 0 : 6,
            opacity: state.isHidden ? 0 : 1,
          }}
          style={{ marginLeft: -3, marginTop: -3 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Ring (follows with lag) */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{ willChange: "transform" }}
      >
        <motion.div
          className="rounded-full border-[1.5px] border-primary flex items-center justify-center"
          animate={{
            width: state.isHovering ? (state.text ? 80 : 50) : 36,
            height: state.isHovering ? (state.text ? 80 : 50) : 36,
            opacity: state.isHidden ? 0 : 1,
            backgroundColor: state.isHovering
              ? "var(--primary-glow)"
              : "rgba(0,0,0,0)",
          }}
          style={{
            marginLeft: state.isHovering ? (state.text ? -40 : -25) : -18,
            marginTop: state.isHovering ? (state.text ? -40 : -25) : -18,
          }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <AnimatePresence mode="wait">
            {state.text && (
              <motion.span
                key={state.text}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="text-[11px] font-heading font-bold text-primary uppercase tracking-wider"
              >
                {state.text}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </>
  );
}
