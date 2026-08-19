"use client";

import { useState, useMemo } from "react";
import type { ReactNode } from "react";
import { translate } from "@/lib/translate";
import { DEPLOYMENT_LOCALE } from "@/lib/i18n";

interface DailyForecast {
  date: string;
  high: number;
  low: number;
  conditionCode: number;
  conditionLabel: string;
  precipitation: number;
  wind: number;
  isRain: boolean;
}

interface WeatherData {
  city?: string;
  country?: string;
  timezone?: string;
  temp: number;
  high: number;
  low: number;
  feelsLike: number;
  humidity: number;
  precipitation?: number;
  wind: number;
  windDirection: string;
  conditionCode?: number;
  conditionLabel?: string;
  isRain?: boolean;
  daily?: DailyForecast[];
}

function WeatherIcon({ code, isRain, size = 60 }: { code?: number; isRain?: boolean; size?: number }) {
  const s = `w-[${size}px] h-[${size}px]`;
  if (isRain || (code !== undefined && code >= 51 && code <= 67) || (code !== undefined && (code === 80 || code === 81 || code === 82))) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={s} fill="none" stroke="white" strokeWidth="1.5">
        <path d="M12 3a5 5 0 0 0-4.6 3A4 4 0 0 0 5 14c0 .1 0 .2.02.3a5 5 0 0 0 3.3 4.4c.3-1.1 1-2 1.9-2.6a2.5 2.5 0 0 1 3.6 0c.9.6 1.6 1.5 1.9 2.6a5 5 0 0 0 3.3-4.4c.01-.1.02-.2.02-.3a4 4 0 0 0-2.4-7A5 5 0 0 0 12 3zm0 0-.7 16" fill="none" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 18l-1.5 3M12 18l-1.5 3M16 18l-1.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    );
  }
  if (code !== undefined && code >= 71 && code <= 86) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={s} fill="none" stroke="white" strokeWidth="1.5">
        <path d="M12 4a4 4 0 0 0-3.8 2.7A5 5 0 0 0 6 13c0 .1 0 .2.02.3A4 4 0 0 0 9 16.9c.3-1.1 1-2 1.9-2.6a2.5 2.5 0 0 1 3.6 0c.9.6 1.6 1.5 1.9 2.6a4 4 0 0 0 3-3.6c.01-.1.02-.2.02-.3a5 5 0 0 0-5-6.3A4 4 0 0 0 12 4z" transform="translate(0 -2)" />
        <path d="M10 18l-1 3M15 18l-1 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
      </svg>
    );
  }
  if (code !== undefined && code >= 95) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={s} fill="none" stroke="white" strokeWidth="1.5">
        <path d="M12 3a5 5 0 0 0-4.6 3A4 4 0 0 0 5 14c0 .1 0 .2.02.3a5 5 0 0 0 3.3 4.4c.3-1.1 1-2 1.9-2.6a2.5 2.5 0 0 1 3.6 0c.9.6 1.6 1.5 1.9 2.6a5 5 0 0 0 3.3-4.4C19 14.2 19 14 19 14a4 4 0 0 0-2.4-7A5 5 0 0 0 12 3z" data-rain="bold"/>
        <path d="M12 5v4M14.2 7L9.8 9.5M14.8 9.5L10.4 12" strokeLinecap="round"/>
      </svg>
    );
  }
  if (code !== undefined && code >= 2) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={s} fill="none" stroke="white" strokeWidth="1.5">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9z" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 384 384" className={s}>
      <defs>
        <linearGradient id="wicon-sun-a" x1="150" x2="234" y1="119.2" y2="264.8" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fbbf24" />
          <stop offset=".5" stopColor="#fbbf24" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
        <symbol id="wicon-sun-b" viewBox="0 0 384 384">
          <circle cx="192" cy="192" r="84" fill="url(#wicon-sun-a)" stroke="#f8af18" strokeMiterlimit="10" strokeWidth="6" />
          <path fill="none" stroke="#fbbf24" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="24" d="M192 61.7V12m0 360v-49.7m92.2-222.5 35-35M64.8 319.2l35.1-35.1m0-184.4-35-35m254.5 254.5-35.1-35.1M61.7 192H12m360 0h-49.7">
            <animateTransform additive="sum" attributeName="transform" dur="6s" repeatCount="indefinite" type="rotate" values="0 192 192; 45 192 192" />
          </path>
        </symbol>
      </defs>
      <use xlinkHref="#wicon-sun-b" width="384" height="384" />
    </svg>
  );
}

const LOCALE_MAP: Record<string, string> = { en: "en-US", es: "es-ES", ar: "ar-EG" };
const DAY_NAMES = { en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], es: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"], ar: ["أحد", "إثن", "ثلا", "أرب", "خمي", "جمع", "سبت"] };
const MONTH_NAMES = {
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
  es: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
  ar: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
};

function formatDate(date: Date, timezone?: string) {
  const locale = LOCALE_MAP[DEPLOYMENT_LOCALE] || "en-US";
  const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric", timeZone: timezone || "UTC" };
  return date.toLocaleDateString(locale, opts).replace(/\//g, "/");
}

function formatTime(date: Date, timezone?: string) {
  const locale = LOCALE_MAP[DEPLOYMENT_LOCALE] || "en-US";
  const opts: Intl.DateTimeFormatOptions = { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: timezone || "UTC" };
  return date.toLocaleTimeString(locale, opts);
}

function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function WeatherWidget({ weather }: { weather?: WeatherData }) {
  const [selectedDate, setSelectedDate] = useState<string>(toDateString(new Date()));
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(() => new Date().getFullYear());

  const todayStr = toDateString(new Date());
  const tz = weather?.timezone;

  const selectedForecast = useMemo(() => {
    if (!weather?.daily) return null;
    return weather.daily.find((d) => d.date === selectedDate) || null;
  }, [weather?.daily, selectedDate]);

  const isToday = selectedDate === todayStr;

  const calendarDays = useMemo(() => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const blanks = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { blanks, days };
  }, [calendarMonth, calendarYear]);

  if (!weather) return null;

  const city = weather.city || "";
  const country = weather.country || "";
  const windInfo = weather.wind > 0 ? `${weather.wind} km/h ${weather.windDirection || ""}` : "";
  const now = new Date();

  const lang = DEPLOYMENT_LOCALE as keyof typeof DAY_NAMES;
  const dayNames = DAY_NAMES[lang] || DAY_NAMES.en;
  const monthNames = MONTH_NAMES[lang] || MONTH_NAMES.en;

  const displayTemp = isToday ? weather.temp : selectedForecast?.high ?? weather.temp;
  const displayHigh = isToday ? weather.high : selectedForecast?.high ?? weather.high;
  const displayLow = isToday ? weather.low : selectedForecast?.low ?? weather.low;
  const displayCondition = isToday ? weather.conditionLabel : selectedForecast?.conditionLabel ?? weather.conditionLabel;
  const displayCode = isToday ? weather.conditionCode : selectedForecast?.conditionCode ?? weather.conditionCode;
  const displayRain = isToday ? weather.isRain : selectedForecast?.isRain ?? weather.isRain;
  const displayPrecipitation = isToday ? weather.precipitation ?? 0 : selectedForecast?.precipitation ?? 0;
  const displayWind = isToday ? weather.wind : selectedForecast?.wind ?? weather.wind;
  const displayWindInfo = displayWind > 0 ? `${displayWind} km/h ${weather.windDirection || ""}` : "";

  const infoItems: { icon: string; label: string; value: ReactNode }[] = [
    { icon: "ri-temp-cold-line", label: translate("widgets.weather.feelsLike"), value: <>{isToday ? weather.feelsLike : displayHigh}<sup>°C</sup></> },
    { icon: "ri-water-percent-line", label: translate("widgets.weather.humidity"), value: <>{isToday ? weather.humidity : "-"}%</> },
    { icon: "ri-pushpin-line", label: translate("widgets.weather.condition"), value: displayCondition || "-" },
    { icon: "ri-umbrella-line", label: translate("widgets.weather.precipitation"), value: <>{displayPrecipitation}%</> },
    { icon: "ri-windy-line", label: translate("widgets.weather.windInfo"), value: displayWindInfo || "-" },
    { icon: "ri-earth-line", label: translate("widgets.weather.country"), value: country || "-" },
  ];

  return (
    <div className="rs-weather text-white">
      <div className="flex flex-col gap-[10px] mb-[20px]">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-[16px] leading-[1.2]">{translate("widgets.weather.title")}</h3>
          <span className="font-medium text-[16px] leading-[1.2]">{formatDate(now, tz)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-medium text-[16px] leading-[1.2]">{isToday ? translate("widgets.weather.currentWeather") : selectedDate}</span>
          <span className="font-medium text-[16px] leading-[1.2]">{formatTime(now, tz)}</span>
        </div>
      </div>

      <div className="weather-header flex items-center justify-between pb-[30px] mb-[25px] border-b border-white/26">
        <div className="flex items-center gap-[10px]">
          <div className="weather_icon custom-svg-img flex-shrink-0 w-[60px] h-[60px]">
            <WeatherIcon code={displayCode} isRain={displayRain} />
          </div>
          <div className="temperature text-[40px] xl:text-[60px] font-semibold">
            {displayTemp}<sup className="text-[20px] xl:text-[35px] ml-[3px]">°C</sup>
          </div>
          {!isToday && (
            <div className="flex items-center gap-2 text-[14px] text-white/70 ml-2">
              <span>H: {displayHigh}°</span>
              <span>L: {displayLow}°</span>
            </div>
          )}
        </div>
        {city && (
          <div className="flex items-center gap-[6px] text-[50px] font-medium leading-[1.2]">
            <i className="ri-map-pin-line text-[50px]" />
            <h3>{city}</h3>
          </div>
        )}
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

      {/* Daily Forecast Strip */}
      {weather.daily && weather.daily.length > 0 && (
        <div className="mt-[25px] pt-[20px] border-t border-white/26">
          <div className="flex items-center justify-between mb-[12px]">
            <span className="text-[14px] font-semibold">{translate("widgets.weather.forecast")}</span>
            <button
              onClick={() => setCalendarOpen(!calendarOpen)}
              className="text-[13px] text-white/70 hover:text-white flex items-center gap-1 cursor-pointer bg-transparent border-none"
            >
              <i className="ri-calendar-line" />
              {translate("widgets.weather.pickDate")}
            </button>
          </div>

          {/* Scrollable daily strip */}
          <div className="flex gap-[8px] overflow-x-auto pb-[8px] scrollbar-hide">
            {weather.daily.map((day) => {
              const isSelected = day.date === selectedDate;
              const d = new Date(day.date + "T12:00:00");
              const dayLabel = dayNames[d.getDay()];
              return (
                <button
                  key={day.date}
                  onClick={() => { setSelectedDate(day.date); setCalendarOpen(false); }}
                  className={`flex-shrink-0 flex flex-col items-center gap-[6px] px-[10px] py-[10px] rounded-xl cursor-pointer transition-all border-none ${
                    isSelected ? "bg-white/20 ring-1 ring-white/40" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className="text-[11px] text-white/60">{dayLabel}</span>
                  <span className="text-[12px] font-medium">{day.date.slice(5)}</span>
                  <WeatherIcon code={day.conditionCode} isRain={day.isRain} size={28} />
                  <div className="flex flex-col items-center">
                    <span className="text-[13px] font-semibold">{day.high}°</span>
                    <span className="text-[11px] text-white/50">{day.low}°</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Calendar Popup */}
          {calendarOpen && (
            <div className="mt-[12px] bg-white/10 rounded-xl p-[16px] backdrop-blur-sm">
              <div className="flex items-center justify-between mb-[12px]">
                <button
                  onClick={() => {
                    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear(calendarYear - 1); }
                    else { setCalendarMonth(calendarMonth - 1); }
                  }}
                  className="text-white/70 hover:text-white cursor-pointer bg-transparent border-none text-[18px]"
                >
                  <i className="ri-arrow-left-s-line" />
                </button>
                <span className="text-[14px] font-semibold">{monthNames[calendarMonth]} {calendarYear}</span>
                <button
                  onClick={() => {
                    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear(calendarYear + 1); }
                    else { setCalendarMonth(calendarMonth + 1); }
                  }}
                  className="text-white/70 hover:text-white cursor-pointer bg-transparent border-none text-[18px]"
                >
                  <i className="ri-arrow-right-s-line" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-[4px] mb-[8px]">
                {dayNames.map((d) => (
                  <div key={d} className="text-center text-[11px] text-white/50 font-medium py-[4px]">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-[4px]">
                {calendarDays.blanks.map((b) => (
                  <div key={`b-${b}`} />
                ))}
                {calendarDays.days.map((day) => {
                  const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const hasForecast = weather.daily?.some((d) => d.date === dateStr);
                  const isSelected = dateStr === selectedDate;
                  const isTodayDate = dateStr === todayStr;
                  return (
                    <button
                      key={day}
                      onClick={() => { if (hasForecast) { setSelectedDate(dateStr); setCalendarOpen(false); } }}
                      disabled={!hasForecast}
                      className={`text-center py-[6px] rounded-lg text-[12px] border-none cursor-pointer transition-all ${
                        isSelected ? "bg-white text-black font-bold" :
                        isTodayDate ? "bg-white/20 text-white font-semibold" :
                        hasForecast ? "bg-transparent text-white hover:bg-white/10" :
                        "bg-transparent text-white/20 cursor-not-allowed"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
