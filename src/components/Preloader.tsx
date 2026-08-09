"use client";

import { useEffect, useState } from "react";

export default function Preloader() {
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setHidden(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const content = (
    <div className="loader-container">
      <div className="loader-icon">
        <span className="loader-brand">Cockpit<span className="loader-brand-dot">.</span>Travel</span>
      </div>
    </div>
  );

  if (!mounted) {
    return (
      <div className="nerio-preloader">
        {content}
      </div>
    );
  }

  return (
    <div className={`nerio-preloader ${hidden ? "hidden" : ""}`}>
      {content}
    </div>
  );
}
