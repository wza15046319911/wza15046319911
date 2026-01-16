"use client";

import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  url: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  isStatic?: boolean;
  imageSrc?: string;
};

// Aceternity-style link preview using Microlink screenshots:
// https://ui.aceternity.com/components/link-preview
export const LinkPreview = ({
  children,
  url,
  className,
  width = 200,
  height = 125,
  quality = 50,
  isStatic = false,
  imageSrc = "",
}: Props) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const previewImage = useMemo(() => {
    if (isStatic && imageSrc) return imageSrc;
    // Microlink trick: embed=screenshot.url returns the screenshot as an image response.
    return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
  }, [imageSrc, isStatic, url]);

  const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const offset = 18;
    const baseX = e.clientX + offset;
    const baseY = e.clientY + offset;

    // Clamp inside viewport (only runs in browser, on mouse move).
    const vw = typeof window !== "undefined" ? window.innerWidth : 0;
    const vh = typeof window !== "undefined" ? window.innerHeight : 0;

    const clampedX = vw ? Math.min(baseX, vw - width - 24) : baseX;
    const clampedY = vh ? Math.min(baseY, vh - height - 24) : baseY;

    setPos({ x: clampedX, y: clampedY });
  };

  return (
    <>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={cn("relative inline-flex", className)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onMouseMove={handleMove}
      >
        {children}
      </a>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 6 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="pointer-events-none fixed z-50"
            style={{ left: pos.x, top: pos.y }}
          >
            <div className="overflow-hidden rounded-xl border border-white/15 bg-black shadow-2xl">
              <Image
                src={previewImage}
                alt={`Preview for ${url}`}
                width={width}
                height={height}
                quality={quality}
                className="block h-auto w-auto"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
