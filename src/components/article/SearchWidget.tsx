"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

export default function SearchWidget() {
  const t = useTranslations();
  const [query, setQuery] = useState("");

  return (
    <div className="rstb-mini-search type-search-form relative">
      <div className="search-form-area relative">
        <form className="relative">
          <input
            type="search"
            placeholder={t("common.searchPlaceholder")}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-[44px] border-none rounded-none bg-shade px-[15px] pr-[55px] text-[15px] text-bodyColor placeholder:text-bodyColor outline-none font-body"
          />
          <button
            type="submit"
            className="submit-btn absolute right-[5px] top-1/2 -translate-y-1/2 z-[2] w-[50px] h-[44px] flex items-center justify-center p-0 text-white bg-primary rounded-[5px] border-none cursor-pointer transition-all duration-300 hover:opacity-80"
          >
            <svg viewBox="0 0 512 512" width="18" height="18" fill="currentColor">
              <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
