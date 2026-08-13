"use client";

import { useEffect, useRef } from "react";

/*
 * Sticky horizontal reading-progress bar pinned to the top edge of the page.
 * Mirrors the reference <reading-progress id="fpg-reading-progress"
 * class="fpg-reading-progress position-top"> element; a single fill span whose
 * scaleX is driven by page scroll progress.
 */
export default function ReadingProgress() {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const compute = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      const total =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      return total <= 0 ? 0 : scrolled / total;
    };

    const render = () => {
      bar.style.transform = `scaleX(${compute()})`;
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          render();
          ticking = false;
        });
        ticking = true;
      }
    };

    render();
    document.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      id="fpg-reading-progress"
      className="fpg-reading-progress position-top"
      style={{ "--fpg-rp-height": "4px", "--fpg-rp-fill": "#0073FF" } as React.CSSProperties}
      role="progressbar"
      aria-hidden="true"
    >
      <span ref={barRef} className="fpg-reading-progress-bar" />
    </div>
  );
}