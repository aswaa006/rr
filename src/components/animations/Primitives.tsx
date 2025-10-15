import { PropsWithChildren } from "react";
import { motion } from "framer-motion";

type BaseProps = PropsWithChildren<{ className?: string; delay?: number; duration?: number }>; 

export const FadeIn = ({ children, className, delay = 0, duration = 0.28 }: BaseProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

type SlideInProps = BaseProps & { direction?: "up" | "down" | "left" | "right"; distance?: number };
export const SlideIn = ({ children, className, delay = 0, duration = 0.3, direction = "up", distance = 16 }: SlideInProps) => {
  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const sign = direction === "up" || direction === "left" ? 1 : -1;
  const initial = axis === "x" ? { x: sign * distance, opacity: 0 } : { y: sign * distance, opacity: 0 };
  const animate = { x: 0, y: 0, opacity: 1 };
  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type ScaleInProps = BaseProps & { factor?: number };
export const ScaleIn = ({ children, className, delay = 0, duration = 0.26, factor = 0.98 }: ScaleInProps) => (
  <motion.div
    initial={{ opacity: 0, scale: factor }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);

type HoverScaleProps = PropsWithChildren<{ className?: string; scale?: number }>;
export const HoverScale = ({ children, className, scale = 1.04 }: HoverScaleProps) => (
  <motion.div whileHover={{ scale }} transition={{ duration: 0.15 }} className={className}>
    {children}
  </motion.div>
);

type HoverShadowProps = PropsWithChildren<{ className?: string; shadow?: number }>;
export const HoverShadow = ({ children, className, shadow = 12 }: HoverShadowProps) => (
  <motion.div whileHover={{ boxShadow: `0 8px ${shadow}px rgba(0,0,0,0.15)` }} transition={{ duration: 0.15 }} className={className}>
    {children}
  </motion.div>
);

type RippleButtonProps = PropsWithChildren<{ className?: string; onClick?: () => void }>;
export const RippleButton = ({ children, className, onClick }: RippleButtonProps) => (
  <motion.button
    className={className}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    style={{ position: "relative", overflow: "hidden" }}
  >
    {children}
  </motion.button>
);


