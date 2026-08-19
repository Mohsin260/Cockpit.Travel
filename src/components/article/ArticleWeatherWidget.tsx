"use client";

import { useWeatherWidget } from "@/hooks/useWeatherWidget";
import WeatherWidget from "@/components/WeatherWidget";

interface ArticleWeatherWidgetProps {
  destination?: string;
  category?: string;
}

export default function ArticleWeatherWidget({ destination, category }: ArticleWeatherWidgetProps) {
  if (category !== "destinations" || !destination) return null;

  const { weather } = useWeatherWidget(destination);

  if (!weather) return null;

  return (
    <div className="my-6 bg-[linear-gradient(144deg,var(--primaryColor)_0%,#62A9FF_100%)] rounded-xl p-5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.1] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNNDAgMGg0MHY0MGgtNDB6IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] bg-[size:40px_40px]" />
      <WeatherWidget weather={weather} />
    </div>
  );
}
