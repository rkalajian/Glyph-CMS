'use client';

import { useRef } from 'react';
import { useScroll, useTransform, motion, useReducedMotion } from 'framer-motion';
import './BubbleBackground.css';

export function BubbleBackground({ variant = 'on-dark' }: { variant?: 'on-dark' | 'on-light' }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], reduced ? ['0%', '0%'] : ['15%', '-15%']);

  return (
    <div ref={ref} className="bubble-bg" aria-hidden="true">
      <motion.div className={`bubble-bg__pattern bubble-bg__pattern--${variant}`} style={{ y }} />
    </div>
  );
}
