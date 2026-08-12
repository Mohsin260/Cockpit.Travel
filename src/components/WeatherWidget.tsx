import type { ReactNode } from "react";

interface WeatherData {
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

function WeatherIcon({ code, isRain }: { code?: number; isRain?: boolean }) {
  if (isRain || (code !== undefined && code >= 51 && code <= 67) || (code !== undefined && (code === 80 || code === 81 || code === 82))) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[48px] h-[48px] fill-[var(--primaryColor)]">
        <path d="M12 3a5 5 0 0 0-4.6 3A4 4 0 0 0 5 14c0 .1 0 .2.02.3a5 5 0 0 0 3.3 4.4c.3-1.1 1-2 1.9-2.6a2.5 2.5 0 0 1 3.6 0c.9.6 1.6 1.5 1.9 2.6a5 5 0 0 0 3.3-4.4c.01-.1.02-.2.02-.3a4 4 0 0 0-2.4-7A5 5 0 0 0 12 3zm0 0-.7 16" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 18l-1.5 3M12 18l-1.5 3M16 18l-1.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (code !== undefined && code >= 71 && code <= 86) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[48px] h-[48px] fill-[var(--primaryColor)]">
        <path d="M12 4a4 4 0 0 0-3.8 2.7A5 5 0 0 0 6 13c0 .1 0 .2.02.3A4 4 0 0 0 9 16.9c.3-1.1 1-2 1.9-2.6a2.5 2.5 0 0 1 3.6 0c.9.6 1.6 1.5 1.9 2.6a4 4 0 0 0 3-3.6c.01-.1.02-.2.02-.3a5 5 0 0 0-5-6.3A4 4 0 0 0 12 4z" transform="translate(0 -2)" />
        <path d="M10 18l-1 3M15 18l-1 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  if (code !== undefined && code >= 95) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[48px] h-[48px]" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3a5 5 0 0 0-4.6 3A4 4 0 0 0 5 14c0 .1 0 .2.02.3a5 5 0 0 0 3.3 4.4c.3-1.1 1-2 1.9-2.6a2.5 2.5 0 0 1 3.6 0c.9.6 1.6 1.5 1.9 2.6a5 5 0 0 0 3.3-4.4C19 14.2 19 14 19 14a4 4 0 0 0-2.4-7A5 5 0 0 0 12 3z" data-rain="bold"/>
        <path d="M12 5v4M14.2 7L9.8 9.5M14.8 9.5L10.4 12" strokeLinecap="round"/>
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[48px] h-[48px]" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  );
}

export default function WeatherWidget({ weather }: { weather?: WeatherData }) {
  if (!weather) return null;

  const city = weather.city || "";
  const country = weather.country || "";
  const windInfo = weather.wind > 0
    ? `${weather.wind} km/h ${weather.windDirection || ""}`
    : "";

  const infoItems: { icon: string; label: string; value: ReactNode }[] = [
    { icon: "ri-temp-cold-line", label: "Feels Like", value: <>{weather.feelsLike}<sup>°C</sup></> },
    { icon: "ri-water-percent-line", label: "Humidity", value: <>{weather.humidity}%</> },
    { icon: "ri-pushpin-line", label: "Condition", value: weather.conditionLabel || "" },
    { icon: "ri-map-pin-line", label: "Current City", value: city || "-" },
    { icon: "ri-windy-line", label: "Wind Info", value: windInfo || "-" },
    { icon: "ri-earth-line", label: "Country", value: country || "-" },
  ];

  return (
    <div className="bg-[var(--cardBg,#f9fafb)] rounded-[12px] p-[20px]">
      <div className="rs-weather">
        <div className="weather-header">
          <div className="weather_icon custom-svg-img">
            <WeatherIcon code={weather.conditionCode} isRain={weather.isRain} />
          </div>
          <div className="temperature">{weather.temp}<sup>°C</sup></div>
        </div>

        <ul className="info_list">
          {infoItems.map((item) => (
            <li key={item.label}>
              <div className="icon-wrapper">
                <i className={item.icon} />
              </div>
              <div className="info_text_wrapper">
                <div className="rs-w-label">{item.label}</div>
                <div className="value-wrapper">{item.value}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}