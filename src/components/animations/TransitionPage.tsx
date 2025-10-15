import { PropsWithChildren } from "react";
import { motion } from "framer-motion";

type TransitionPageProps = PropsWithChildren<{
  initial?: object;
  animate?: object;
  exit?: object;
  duration?: number;
  className?: string;
}>;

const TransitionPage = ({
  children,
  initial = { opacity: 0, y: 8 },
  animate = { opacity: 1, y: 0 },
  exit = { opacity: 0, y: -8 },
  duration = 0.28,
  className,
}: TransitionPageProps) => {
  return (
    <motion.div
      initial={initial}
      animate={animate}
      exit={exit}
      transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default TransitionPage;


