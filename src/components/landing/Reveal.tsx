'use client';

import React, { useEffect, useRef, useState } from 'react';

type Variant = 'up' | 'left' | 'right' | 'scale' | 'flip';

type RevealProps = {
  children: React.ReactNode;
  as?: 'div' | 'li' | 'section';
  className?: string;
  /** How the block arrives: slides up, slides in from a side, grows in, or tips forward like a card. */
  variant?: Variant;
  /** Wait this many milliseconds before appearing, to stagger neighbours. */
  delay?: number;
};

const HIDDEN: Record<Variant, string> = {
  up: 'opacity-0 translate-y-12',
  left: 'opacity-0 -translate-x-20',
  right: 'opacity-0 translate-x-20',
  scale: 'opacity-0 scale-90 translate-y-8',
  flip: 'opacity-0 [transform:perspective(900px)_rotateX(24deg)_translateY(48px)]'
};

const SHOWN: Record<Variant, string> = {
  up: 'opacity-100 translate-y-0',
  left: 'opacity-100 translate-x-0',
  right: 'opacity-100 translate-x-0',
  scale: 'opacity-100 scale-100 translate-y-0',
  flip: 'opacity-100 [transform:perspective(900px)_rotateX(0deg)_translateY(0)]'
};

// Brings its content in when it scrolls into view.
// The content is visible in the server HTML, so search engines and visitors without JavaScript see everything.
// Only blocks that start below the fold are hidden after the page loads, then shown as they come into view.
export default function Reveal({ children, as = 'div', className = '', variant = 'up', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<'visible' | 'hidden' | 'shown'>('visible');
  // Visitors who ask their device for less motion get a plain fade, with no sliding or tipping
  const [calm, setCalm] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.95) return;

    setCalm(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    setState('hidden');
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState('shown');
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;

  return (
    <Tag
      ref={ref}
      className={`${className} transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
        state === 'hidden' ? (calm ? 'opacity-0' : HIDDEN[variant]) : SHOWN[variant]
      }`}
      style={state === 'shown' && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
