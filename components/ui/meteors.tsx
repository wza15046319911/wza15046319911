"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const generateMeteorStyles = (count: number) => {
  return new Array(count).fill(true).map(() => ({
    top: 0,
    left: Math.floor(Math.random() * (400 - -400) + -400) + "px",
    animationDelay: Math.random() * (0.8 - 0.2) + 0.2 + "s",
    animationDuration: Math.floor(Math.random() * (10 - 2) + 2) + "s",
  }));
};

export const Meteors = ({ number = 20, className }: { number?: number; className?: string }) => {
  // Use useState with null initial value and useEffect to set styles only on client
  // This prevents hydration mismatch by ensuring random values are only generated on the client
  const [meteorStyles, setMeteorStyles] = useState<Array<{
    top: number;
    left: string;
    animationDelay: string;
    animationDuration: string;
  }> | null>(null);

  useEffect(() => {
    setMeteorStyles(generateMeteorStyles(number));
  }, [number]);

  // Return empty fragment during SSR to avoid hydration mismatch
  if (!meteorStyles) {
    return null;
  }

  return (
    <>
      {meteorStyles.map((style, idx) => (
        <span
          key={"meteor" + idx}
          className={cn(
            "animate-meteor-effect absolute top-1/2 left-1/2 h-0.5 w-0.5 rotate-[215deg] rounded-[9999px] bg-slate-500 shadow-[0_0_0_1px_#ffffff10]",
            "before:absolute before:top-1/2 before:h-[1px] before:w-[50px] before:-translate-y-[50%] before:transform before:bg-gradient-to-r before:from-[#64748b] before:to-transparent before:content-['']",
            className
          )}
          style={style}
        ></span>
      ))}
    </>
  );
};
