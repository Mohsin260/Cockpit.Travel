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
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[60px] h-[60px]" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M12 3a5 5 0 0 0-4.6 3A4 4 0 0 0 5 14c0 .1 0 .2.02.3a5 5 0 0 0 3.3 4.4c.3-1.1 1-2 1.9-2.6a2.5 2.5 0 0 1 3.6 0c.9.6 1.6 1.5 1.9 2.6a5 5 0 0 0 3.3-4.4c.01-.1.02-.2.02-.3a4 4 0 0 0-2.4-7A5 5 0 0 0 12 3zm0 0-.7 16" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 18l-1.5 3M12 18l-1.5 3M16 18l-1.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (code !== undefined && code >= 71 && code <= 86) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[60px] h-[60px]" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M12 4a4 4 0 0 0-3.8 2.7A5 5 0 0 0 6 13c0 .1 0 .2.02.3A4 4 0 0 0 9 16.9c.3-1.1 1-2 1.9-2.6a2.5 2.5 0 0 1 3.6 0c.9.6 1.6 1.5 1.9 2.6a4 4 0 0 0 3-3.6c.01-.1.02-.2.02-.3a5 5 0 0 0-5-6.3A4 4 0 0 0 12 4z" transform="translate(0 -2)" />
        <path d="M10 18l-1 3M15 18l-1 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  if (code !== undefined && code >= 95) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-[60px] h-[60px]" fill="none" stroke="white" strokeWidth="1.5">
        <path d="M12 3a5 5 0 0 0-4.6 3A4 4 0 0 0 5 14c0 .1 0 .2.02.3a5 5 0 0 0 3.3 4.4c.3-1.1 1-2 1.9-2.6a2.5 2.5 0 0 1 3.6 0c.9.6 1.6 1.5 1.9 2.6a5 5 0 0 0 3.3-4.4C19 14.2 19 14 19 14a4 4 0 0 0-2.4-7A5 5 0 0 0 12 3z" data-rain="bold"/>
        <path d="M12 5v4M14.2 7L9.8 9.5M14.8 9.5L10.4 12" strokeLinecap="round"/>
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 384 384" className="w-[60px] h-[60px]">
      <defs>
        <linearGradient id="wicon-sun-a" x1="150" x2="234" y1="119.2" y2="264.8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset=".5" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <symbol id="wicon-sun-b" viewBox="0 0 384 384">
          <circle cx="192" cy="192" r="84" fill="url(#wicon-sun-a)" stroke="#f8af18" strokeMiterlimit="10" strokeWidth="6" />
          <path fill="none" stroke="#fbbf24" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="24" d="M192 61.7V12m0 360v-49.7m92.2-222.5 35-35M64.8 319.2l35.1-35.1m0-184.4-35-35m254.5 254.5-35.1-35.1M61.7 192H12m360 0h-49.7" />
        </symbol>
      </defs>
      <use xlinkHref="#wicon-sun-b" width="384" height="384" />
    </svg>
  );
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, "/");
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export default function WeatherWidget({ weather }: { weather?: WeatherData }) {
  if (!weather) return null;

  const city = weather.city || "";
  const country = weather.country || "";
  const windInfo = weather.wind > 0
    ? `${weather.wind} km/h ${weather.windDirection || ""}`
    : "";
  const now = new Date();

  const infoItems: { icon: string; label: string; value: ReactNode }[] = [
    { icon: "ri-temp-cold-line", label: "Feels Like", value: <>{weather.feelsLike}<sup>°C</sup></> },
    { icon: "ri-water-percent-line", label: "Humidity", value: <>{weather.humidity}%</> },
    { icon: "ri-pushpin-line", label: "Condition", value: weather.conditionLabel || "" },
    { icon: "ri-map-pin-line", label: "Current City", value: city || "-" },
    { icon: "ri-windy-line", label: "Wind Info", value: windInfo || "-" },
    { icon: "ri-earth-line", label: "Country", value: country || "-" },
  ];

  return (
    <div className="rs-weather text-white">
      <div className="flex flex-col gap-[10px] mb-[20px]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[16px] leading-[1.2]">Weather</h3>
          <span className="font-medium text-[16px] leading-[1.2]">{formatDate(now)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-[16px] leading-[1.2]">Current weather</span>
          <span className="font-medium text-[16px] leading-[1.2]">{formatTime(now)}</span>
        </div>
      </div>

      <div className="weather-header flex items-center gap-[10px] pb-[30px] mb-[25px] border-b border-white/26">
        <div className="weather_icon custom-svg-img flex-shrink-0 w-[60px] h-[60px]">
          <WeatherIcon code={weather.conditionCode} isRain={weather.isRain} />
        </div>
        <div className="temperature text-[40px] xl:text-[60px] font-semibold">
          {weather.temp}<sup className="text-[20px] xl:text-[35px] ml-[3px]">°C</sup>
        </div>
      </div>

      <ul className="info_list flex flex-wrap justify-between gap-[18px] p-0 m-0 list-none">
        {infoItems.map((item) => (
          <li key={item.label} className="max-w-[47%] text-[14px] leading-[1em]">
            <div className="flex items-center gap-[10px]">
              <div className="icon-wrapper flex-shrink-0 text-[24px]" style={{ color: "white" }}>
                <i className={item.icon} />
              </div>
              <div className="info_text_wrapper flex flex-col-reverse gap-[10px] flex-1">
                <div className="value-wrapper text-white">{item.value}</div>
                <div className="rs-w-label font-normal text-white" style={{ fontSize: "14px", fontWeight: 400, lineHeight: "1.2em" }}>
                  {item.label}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}