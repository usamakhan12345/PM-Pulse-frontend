'use client';

import React, { useEffect, useRef, useState } from 'react';

type AnimatedTextProps = {
  text: string;
  as?: 'h2' | 'h3' | 'p';
  className?: string;
  id?: string;
  /** Wait this many milliseconds before the first word appears. */
  delay?: number;
  /** Milliseconds between one word and the next. Use a small value for long paragraphs. */
  stagger?: number;
};

// Shows text one word at a time as it scrolls into view.
// The words are in the server HTML, so search engines and visitors without JavaScript read normal text.
// Only text that starts below the fold is hidden after the page loads, then revealed on scroll.
export default function AnimatedText({ text, as = 'p', className = '', id, delay = 0, stagger = 45 }: AnimatedTextProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [state, setState] = useState<'visible' | 'hidden' | 'shown'>('visible');
  // Visitors who ask their device for less motion get a plain fade, with no movement or blur
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
      { threshold: 0.2, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = as as React.ElementType;
  const words = text.split(' ');
  const wordMotion =
    state === 'hidden' ? (calm ? 'opacity-0' : 'opacity-0 translate-y-3 blur-[3px]') : 'opacity-100 translate-y-0 blur-0';

  return (
    <Tag ref={ref} id={id} className={className}>
      {words.map((word, i) => (
        <React.Fragment key={i}>
          <span
            className={`inline-block transition-[opacity,transform,filter] duration-500 ease-out ${wordMotion}`}
            style={state === 'shown' ? { transitionDelay: `${delay + i * stagger}ms` } : undefined}
          >
            {word}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </Tag>
  );
}
