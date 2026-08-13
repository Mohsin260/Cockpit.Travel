"use client";

import { useEffect, useState } from "react";
import BrandLogo from "@/components/ui/BrandLogo";

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
        <span className="loader-brand">
          <BrandLogo
            className=""
            part1ClassName=""
            part2ClassName=""
            dotClassName="loader-brand-dot"
            gap="0"
          />
        </span>
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
