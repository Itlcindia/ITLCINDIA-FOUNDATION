'use client';

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function RouteProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);

    setIsVisible(true);
    setProgress(25);

    animIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          if (animIntervalRef.current) clearInterval(animIntervalRef.current);
          return 85;
        }
        return prev + Math.random() * 12 + 6;
      });
    }, 120);
  };

  const completeProgress = () => {
    if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    setProgress(100);

    timerRef.current = setTimeout(() => {
      setIsVisible(false);
      setProgress(0);
    }, 250);
  };

  useEffect(() => {
    completeProgress();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animIntervalRef.current) clearInterval(animIntervalRef.current);
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      if (
        !href ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('#') ||
        targetAttr === '_blank'
      ) {
        return;
      }

      const currentUrl = window.location.pathname;
      if (href === currentUrl || href === currentUrl + '/') {
        return;
      }

      startProgress();
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleDocumentClick, { capture: true });
    };
  }, []);

  if (!isVisible && progress === 0) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[3px] z-[9999] pointer-events-none overflow-hidden"
    >
      <div
        className="h-full bg-gradient-to-r from-[#0f5b9e] via-[#168039] to-[#22c55e] shadow-[0_0_12px_rgba(22,128,57,0.85)] transition-all duration-200 ease-out"
        style={{
          width: `${progress}%`,
          opacity: isVisible ? 1 : 0,
        }}
      />
    </div>
  );
}
