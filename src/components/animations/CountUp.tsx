import { useEffect, useMemo, useRef, useState } from "react";

type CountUpProps = {
  from?: number;
  to: number;
  duration?: number; // seconds
  formatter?: (n: number) => string;
  className?: string;
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const CountUp = ({ from = 0, to, duration = 1, formatter, className }: CountUpProps) => {
  const [value, setValue] = useState(from);
  const startTsRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const display = useMemo(() => (formatter ? formatter(value) : Math.round(value).toString()), [formatter, value]);

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startTsRef.current = null;

    const tick = (ts: number) => {
      if (!startTsRef.current) startTsRef.current = ts;
      const elapsed = (ts - startTsRef.current) / 1000;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      setValue(from + (to - from) * eased);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [from, to, duration]);

  return <span className={className}>{display}</span>;
};

export default CountUp;


