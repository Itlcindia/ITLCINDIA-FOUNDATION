'use client';
import { motion, useScroll } from 'framer-motion';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-[0%] z-[100] pointer-events-none"
      style={{ scaleX: scrollYProgress }}
    />
  );
}
