import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, CloudSnow, Wind } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  rainChance: number;
  description: string;
}

const getWeatherIcon = (condition: string) => {
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('rain') || conditionLower.includes('storm')) {
    return CloudRain;
  }
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return Cloud;
  }
  if (conditionLower.includes('snow')) {
    return CloudSnow;
  }
  return Sun;
};

export default function WeatherWidget() {
  const { data: weather, isLoading, error } = useQuery<WeatherData>({
    queryKey: ["/api/weather/winter-haven"],
    refetchInterval: 10 * 60 * 1000, // Refresh every 10 minutes
  });

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2 animate-pulse">
        <div className="w-4 h-4 bg-blue-200 rounded"></div>
        <div className="w-16 h-4 bg-blue-200 rounded"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2">
        <Cloud className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">Weather unavailable</span>
      </div>
    );
  }

  const WeatherIcon = getWeatherIcon(weather.condition);

  return (
    <div className="flex items-center space-x-3 bg-blue-50 rounded-lg px-3 py-2">
      <WeatherIcon className="w-4 h-4 text-blue-600" />
      <div className="flex items-center space-x-2">
        <span className="text-sm font-semibold text-blue-900">{Math.round(weather.temperature)}°F</span>
        <span className="text-xs text-blue-700">|</span>
        <span className="text-xs text-blue-700">{weather.rainChance}% rain</span>
      </div>
    </div>
  );
}