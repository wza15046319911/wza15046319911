"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type LivePreviewProject = {
  title: string;
  link?: string;
  github?: string;
  img?: string;
};

const useLockScroll = (enabled: boolean) => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [enabled]);
};

const LivePreviewModal = ({
  title,
  url,
  image,
  onClose,
}: {
  title: string;
  url?: string;
  image?: string;
  onClose: () => void;
}) => {
  useLockScroll(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-5xl rounded-3xl border border-white/10 bg-gradient-to-br from-neutral-900 via-slate-950 to-black p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
              Aceternity Preview
            </p>
            <h3 className="text-2xl font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white transition hover:border-white"
          >
            Close
          </button>
        </div>

        <div className="mt-6 h-[65vh] w-full overflow-hidden rounded-2xl border border-white/5 bg-neutral-900">
          {url ? (
            <iframe
              src={url}
              title={`${title} live preview`}
              className="h-full w-full bg-black"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
            />
          ) : image ? (
            <Image
              src={image}
              width={1200}
              height={900}
              alt={`${title} preview`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-white/10 to-transparent text-sm text-white/70">
              Live preview unavailable for this project.
            </div>
          )}
        </div>

        <p className="mt-4 text-sm text-white/70">
          Powered by Aceternity live-preview — interact with the project inside the modal.
        </p>
        {url && (
          <div className="mt-2 flex items-center gap-2 text-xs text-white/70">
            <span className="rounded-full border border-white/20 px-2 py-1 uppercase tracking-[0.3em] text-white/80">
              preview
            </span>
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Open full site ↗
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export const LivePreviewTrigger = ({ project }: { project: LivePreviewProject }) => {
  const [open, setOpen] = useState(false);
  const previewUrl = project.link || project.github;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center gap-2 rounded-2xl border border-white/15 px-3 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5",
          "bg-gradient-to-r from-white/10 via-white/5 to-transparent text-white"
        )}
      >
        <span className="text-xs uppercase tracking-[0.3em] text-white/70">Live Demo</span>
        <span className="-mt-0.5 text-base font-bold leading-none text-white">Preview</span>
      </button>

      {open && (
        <LivePreviewModal
          title={project.title}
          url={previewUrl}
          image={project.img}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};
