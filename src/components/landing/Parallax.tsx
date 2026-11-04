'use client';

import React, { useEffect, useRef } from 'react';

type ParallaxProps = {
  children: React.ReactNode;
  /** How far the content drifts against the scroll. 0.08 means 8% of its distance from the screen centre. */
  speed?: number;
  className?: string;
};

// Moves its content a little slower than the page, so images seem to float above the background.
export default function Parallax({ children, speed = 0.08, className = '' }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      // Measure the parent: this element is moved by us, so its own position would feed back into the maths.
      const rect = parent.getBoundingClientRect();
      const viewport = window.innerHeight;
      if (rect.bottom < -300 || rect.top > viewport + 300) return;
      const offset = rect.top + rect.height / 2 - viewport / 2;
      el.style.transform = `translate3d(0, ${(-offset * speed).toFixed(1)}px, 0)`;
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
  }, [speed]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
