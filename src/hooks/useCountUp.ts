import { useEffect, useState } from 'react';
import { useTheme } from '../components/ThemeProvider';

export function useCountUp(target: number, durationMs = 650): number {
  const { reduceMotion } = useTheme();
  const [value, setValue] = useState(() => (reduceMotion ? target : 0));

  useEffect(() => {
    if (reduceMotion) {
      setValue(target);
      return;
    }

    let rafId = 0;
    const start = performance.now();

    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, durationMs, reduceMotion]);

  return value;
}
