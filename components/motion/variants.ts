import type { Variants } from "framer-motion";

export const PAGE_ENTER: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.25, ease: [0.7, 0, 0.84, 0] },
  },
};

export const FADE: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// Stopwatch ticks — the 50s mission animation pulses one of these per second.
export const TICK: Variants = {
  rest: { scale: 1, opacity: 0.6 },
  pulse: {
    scale: 1.08,
    opacity: 1,
    transition: { duration: 0.15, ease: "easeOut" },
  },
};

export const STAGGER_CHILDREN: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

export const CHILD_RISE: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};
