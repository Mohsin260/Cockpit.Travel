"use client";

import { useEffect, useRef } from "react";

export default function ScrollToTop() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const max = parseFloat(el.dataset.max || "113.1");
    const unit = el.dataset.unit || "px";

    let ticking = false;

    const update = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      let value = progress * max;
      if (el.dataset.reverse === "true") value = max - value;
      value = Math.max(0, Math.min(value, max));

      el.style.setProperty("--rs-page-scroll-progress", `${value}${unit}`);

      if (scrollTop > 150) {
        if (el.style.display !== "block") el.style.display = "block";
      } else {
        if (el.style.display !== "none") el.style.display = "none";
      }

      ticking = false;
    };

    const requestTick = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };

    const onScroll = () => requestTick();
    const onLoadResize = () => update();

    onLoadResize();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("load", onLoadResize);
    window.addEventListener("resize", onLoadResize);

    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      if ("scrollBehavior" in document.documentElement.style) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    el.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", onLoadResize);
      window.removeEventListener("resize", onLoadResize);
      el.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <div
      id="rs-scroll-to-top"
      ref={containerRef}
      data-max="113.1"
      data-unit="px"
      data-reverse="true"
    >
      <svg
        className="arrowup"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M13 7.828V20h-2V7.828l-5.364 5.364-1.414-1.414L12 4l7.778 7.778-1.414 1.414L13 7.828z" />
      </svg>
      <svg className="scrollprogress" width="40" height="40">
        <circle
          className="progress-circle"
          cx="20"
          cy="20"
          r="18"
          strokeWidth="2"
          fill="none"
          strokeDasharray="113.1"
          strokeDashoffset="113.1"
        />
      </svg>
    </div>
  );
}