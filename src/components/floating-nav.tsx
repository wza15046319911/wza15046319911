"use client";

import { useState } from "react";
import { useLenis } from "lenis/react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import { profile } from "@/lib/data";

const links = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function FloatingNav() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setVisible(latest > 480 && latest < previous);
  });

  const goTo = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    if (lenis) {
      lenis.scrollTo(href === "#top" ? 0 : href, { offset: -16, duration: 1.2 });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.nav
          initial={{ y: -56 }}
          animate={{ y: 0 }}
          exit={{ y: -56 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-sm"
        >
          <div className="mx-auto flex h-12 max-w-[1100px] items-center justify-between px-5 md:px-8">
            <a
              href="#top"
              onClick={(e) => goTo(e, "#top")}
              className="text-sm font-bold tracking-tight text-ink"
            >
              Zane Wang
            </a>
            <div className="flex items-center gap-5 text-sm">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => goTo(e, link.href)}
                  className="text-dim underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={profile.resume}
                target="_blank"
                rel="noreferrer"
                className="text-blue underline underline-offset-4 hover:no-underline"
              >
                CV
              </a>
            </div>
          </div>
        </motion.nav>
      ) : null}
    </AnimatePresence>
  );
}
