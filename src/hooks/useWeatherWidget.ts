"use client";

import { useEffect, useState } from "react";
import { getWeatherDataAction } from "@/lib/actions/weather";
import { useLocale } from "@/hooks/useLocale";

export interface WeatherWidgetData {
  city?: string;
  country?: string;
  temp: number;
  high: number;
  low: number;
  feelsLike: number;
  humidity: number;
  wind: number;
  windDirection: string;
  conditionCode?: number;
  conditionLabel?: string;
  isRain?: boolean;
}

export function useWeatherWidget(city?: string) {
  const locale = useLocale();
  const [weather, setWeather] = useState<WeatherWidgetData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);

      let options: { city?: string; lat?: number; lon?: number } = city
        ? { city }
        : { city: locale === "es" ? "Madrid" : locale === "ar" ? "Riyadh" : "London" };

      // Prefer browser geolocation when no explicit city was provided
      if (!city && typeof navigator !== "undefined" && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 8000 })
          );
          options = { lat: position.coords.latitude, lon: position.coords.longitude };
        } catch {
          // fall back to default city below
        }
      }

      const result = await getWeatherDataAction(options);
      if (!cancelled && result.success && result.data) {
        setWeather(result.data);
      }
      if (!cancelled) setLoading(false);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [city, locale]);

  return { weather, loading };
}