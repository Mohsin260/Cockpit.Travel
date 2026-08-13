"use client";

import { useTranslations } from "@/hooks/useTranslations";

interface BrandLogoProps {
  className?: string;
  part1ClassName?: string;
  part2ClassName?: string;
  dotClassName?: string;
  gap?: string;
}

export default function BrandLogo({
  className,
  part1ClassName = "text-[#0073FF]",
  part2ClassName = "text-white",
  dotClassName = "text-white",
  gap = "-0.40rem",
}: BrandLogoProps) {
  const t = useTranslations("common");

  return (
    <span className={className}>
      <span className={part1ClassName}>{t("brandPart1")}</span>
      <span className={dotClassName}>.</span>
      <span className={part2ClassName}>
        {t("brandPart2")}
      </span>
    </span>
  );
}
