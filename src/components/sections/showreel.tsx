"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useLocale } from "next-intl";
import { Play, X } from "lucide-react";
import Image from "next/image";

interface ShowreelData {
  heading_en?: string;
  heading_ar?: string;
  subtitle_en?: string;
  subtitle_ar?: string;
  videoUrl?: string;
  coverImage?: {
    asset?: {
      url?: string;
      metadata?: { lqip?: string; dimensions?: { width: number; height: number } };
    };
  };
}

function resolveEmbedSrc(url: string): string {
  const yt = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/
  );
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&controls=1&rel=0&fs=1`;

  const vi = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vi)
    return `https://player.vimeo.com/video/${vi[1]}?autoplay=1&controls=1&color=ffffff&title=0&byline=0&portrait=0`;

  return url;
}

function isDirectFile(url: string) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export default function Showreel({ data }: { data?: ShowreelData }) {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const [playing, setPlaying] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  // Ref to the player block — used to scroll it into view on play
  const playerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  const heading =
    (isRtl ? data?.heading_ar : data?.heading_en) ||
    (isRtl ? "شاهد ريل الأعمال" : "Watch My Showreel");
  const subtitle =
    (isRtl ? data?.subtitle_ar : data?.subtitle_en) ||
    (isRtl ? "لمحة من عالمي الإبداعي" : "A glimpse into my creative world");

  const coverImageUrl = data?.coverImage?.asset?.url;
  const lqip = data?.coverImage?.asset?.metadata?.lqip;
  const videoUrl = data?.videoUrl;
  const hasVideo = Boolean(videoUrl);
  const embedSrc = videoUrl ? resolveEmbedSrc(videoUrl) : "";
  const isDirect = videoUrl ? isDirectFile(videoUrl) : false;

  // When play is clicked → set playing, then scroll so the player
  // starts just below the fixed navbar (scroll-mt-20 = 80px offset)
  const handlePlay = () => {
    setPlaying(true);
    setTimeout(() => {
      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);
  };

  return (
    <section
      id="showreel"
      ref={sectionRef}
      className="relative w-full"
      dir={isRtl ? "rtl" : "ltr"}
      aria-label={heading}
    >
      {/* ══════════════════════════════════════════
          STATE A — Cover + Play button
          Hidden (opacity-0, pointer-events-none) when playing
          ══════════════════════════════════════════ */}
      <motion.div
        animate={{ opacity: playing ? 0 : 1 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ pointerEvents: playing ? "none" : "auto" }}
        className={`relative w-full overflow-hidden bg-black ${playing ? "absolute inset-0 h-full" : "h-[56vw] min-h-[320px] max-h-[85vh]"}`}
      >
        {/* Parallax image */}
        <motion.div className="absolute inset-0 w-full h-[115%] top-[-7.5%]" style={{ y: bgY }}>
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
              alt={heading}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              placeholder={lqip ? "blur" : "empty"}
              blurDataURL={lqip}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950" />
          )}
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/65 z-10" />

        {/* Content */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center gap-6 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-2"
          >
            <p className="text-white/65 text-xs sm:text-sm tracking-widest uppercase font-medium">
              {subtitle}
            </p>
            <h2 className="text-white font-bold text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight drop-shadow-2xl">
              {heading}
            </h2>
          </motion.div>

          {hasVideo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.18, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <button
                id="showreel-play-btn"
                onClick={() => setPlaying(true)}
                aria-label={isRtl ? "تشغيل الفيديو" : "Play video"}
                className="relative group focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 rounded-full"
              >
                <span className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                <span className="absolute inset-[-10px] rounded-full border border-white/20 animate-[ping_2.2s_ease-in-out_0.6s_infinite]" />
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.93 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18 }}
                  className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 border-2 border-white/55 backdrop-blur-md shadow-[0_0_60px_rgba(255,255,255,0.18)] group-hover:bg-white/20 group-hover:border-white transition-colors duration-300"
                >
                  <Play size={30} className={`text-white fill-white ${isRtl ? "" : "ml-1"}`} aria-hidden />
                </motion.span>
              </button>
            </motion.div>
          )}

          {!hasVideo && (
            <p className="text-white/35 text-xs font-mono mt-1">[No videoUrl set in Sanity Studio]</p>
          )}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          STATE B — Player
          Layout (in normal document flow, no absolute):

            ┌─────────────────────────────────────┐
            │   iframe  —  pure 16:9, no bars     │
            └─────────────────────────────────────┘
                                          [ ✕ ]
          
          The X is in a separate row BELOW the iframe.
          It never overlaps anything inside the video.
          ══════════════════════════════════════════ */}
      {hasVideo && playing && (
        <motion.div
          ref={playerRef}
          key="player-block"
          // scroll-mt-20 = 80px top margin when scrollIntoView is called
          // so the block starts below the fixed navbar naturally
          className="w-full scroll-mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {/* ── Close button row — above the iframe, right-aligned ──
              scrollIntoView ensures this row is always below the navbar
              so it's always clickable with no z-index tricks needed.  ── */}
          <motion.div
            className="flex justify-end px-4 py-2"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.25 }}
          >
            <button
              id="showreel-close-btn"
              onClick={() => setPlaying(false)}
              aria-label={isRtl ? "إغلاق الفيديو" : "Close video"}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-border/60 hover:bg-border text-text-primary transition-colors text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
            >
              <X size={15} aria-hidden />
              <span>{isRtl ? "إغلاق" : "Close"}</span>
            </button>
          </motion.div>

          {/* ── Pure 16:9 iframe — zero bars, zero padding ── */}
          <div className="w-full aspect-video bg-black">
            {isDirect ? (
              <video
                src={embedSrc}
                autoPlay
                controls
                controlsList="nodownload"
                className="w-full h-full object-contain"
                aria-label={heading}
              />
            ) : (
              <iframe
                src={embedSrc}
                title={heading}
                allow="autoplay; fullscreen; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0 block"
              />
            )}
          </div>
        </motion.div>
      )}
    </section>
  );
}
