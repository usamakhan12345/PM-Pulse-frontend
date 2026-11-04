'use client';

import React, { useEffect, useRef } from 'react';

// A thin bar across the top of the page that fills as the visitor scrolls down.
export default function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const bar = ref.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-50 h-[3px] pointer-events-none">
      <div
        ref={ref}
        className="h-full origin-left scale-x-0 bg-gradient-to-r from-brand-500 via-indigo-500 to-sky-400 shadow-[0_0_12px_rgba(99,102,241,0.8)]"
      />
    </div>
  );
}
