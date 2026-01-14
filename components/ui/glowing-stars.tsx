"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export const GlowingStarsBackgroundCard = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const [mouseEnter, setMouseEnter] = useState(false);

  return (
    <div
      onMouseEnter={() => {
        setMouseEnter(true);
      }}
      onMouseLeave={() => {
        setMouseEnter(false);
      }}
      className={`bg-opacity-50 relative h-full w-full overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 ${className}`}
    >
      <div className="flex h-full items-center justify-center">
        <Illustration mouseEnter={mouseEnter} />
      </div>
      <div className="relative z-20 px-2 pb-2">{children}</div>
    </div>
  );
};

export const GlowingStarsDescription = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return <p className={`max-w-[10rem] text-base text-neutral-200 ${className}`}>{text}</p>;
};

export const GlowingStarsTitle = ({ text, className }: { text: string; className?: string }) => {
  return <h3 className={`text-2xl font-bold text-neutral-100 ${className}`}>{text}</h3>;
};

const Illustration = ({ mouseEnter }: { mouseEnter: boolean }) => {
  const stars = 108;
  const columns = 18;

  const [glowingStars, setGlowingStars] = useState<number[]>([]);

  const highlightedStars = useRef<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      highlightedStars.current = Array.from({ length: 5 }, () => Math.floor(Math.random() * stars));
      setGlowingStars([...highlightedStars.current]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute inset-0 z-0 grid h-full w-full gap-1 p-1"
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
      }}
    >
      {[...Array(stars)].map((_, starIdx) => {
        const isGlowing = glowingStars.includes(starIdx);
        const delay = (starIdx % 10) * 0.1;
        const staticDelay = starIdx * 0.01;
        return (
          <div
            key={`matrix-col-${starIdx}}`}
            className="relative flex items-center justify-center bg-transparent"
          >
            <Star
              isGlowing={mouseEnter ? true : isGlowing}
              delay={mouseEnter ? staticDelay : delay}
            />
            {mouseEnter && <Glow delay={staticDelay} />}
            <AnimatePresence mode="wait">{isGlowing && <Glow delay={delay} />}</AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

const Star = ({ isGlowing, delay }: { isGlowing: boolean; delay: number }) => {
  return (
    <motion.div
      key={delay}
      initial={{
        scale: 1,
      }}
      animate={{
        scale: isGlowing ? [1, 1.2, 2.5, 2.2, 1.5] : 1,
        background: isGlowing ? "#fff" : "#666",
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        delay: delay,
      }}
      className={`relative z-20 h-[1px] w-[1px] rounded-full bg-[#666]`}
    ></motion.div>
  );
};

const Glow = ({ delay }: { delay: number }) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        delay: delay,
      }}
      className="absolute left-1/2 z-10 h-[4px] w-[4px] -translate-x-1/2 rounded-full bg-blue-500 shadow-2xl shadow-blue-400 blur-[1px]"
    />
  );
};
