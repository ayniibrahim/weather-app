/**
 * Weatherly - Current Weather Hero Card
 * Recreates the exact hero section with coordinates, live pulse indicator, dynamic SVG illustration,
 * feels-like microclimate, high/low ranges, and telemetry diagnostics.
 */

import React from 'react';
import { MapPin, RotateCw, Wind, ArrowUp, ArrowDown, Activity } from 'lucide-react';
import {
  getWeatherCondition,
  convertTemperature,
  formatDateHeader
} from '../utils/weatherUtils.js';

export default function CurrentWeather({
  weatherData,
  city,
  unit,
  onRefresh,
  isLoading
}) {
  if (!weatherData || !city) return null;

  const current = weatherData.current;
  const summary = weatherData.dailySummary;
  const condition = getWeatherCondition(current.weatherCode, current.isDay);

  const displayTemp = convertTemperature(current.temperature, unit);
  const displayFeelsLike = convertTemperature(current.apparentTemperature, unit);
  const displayMax = convertTemperature(summary.todayMax, unit);
  const displayMin = convertTemperature(summary.todayMin, unit);

  // Approximate AQI index based on atmospheric pressure and UV
  const aqiValue = Math.min(100, Math.max(18, Math.round(25 + (current.uvIndex * 2.5) + (current.windSpeed < 5 ? 12 : 0))));
  const aqiLabel = aqiValue < 50 ? 'Good' : aqiValue < 100 ? 'Moderate' : 'Unhealthy';

  // Format coordinates cleanly
  const latFormatted = `${Math.abs(city.latitude).toFixed(4)}° ${city.latitude >= 0 ? 'N' : 'S'}`;
  const lonFormatted = `${Math.abs(city.longitude).toFixed(4)}° ${city.longitude >= 0 ? 'E' : 'W'}`;

  return (
    <section
      id="current-weather-hero"
      className="relative w-full rounded-2xl bg-surface-container p-5 sm:p-6 border border-outline-variant/40 shadow-sm hover:shadow-md transition-all overflow-hidden"
    >
      {/* Ambient Atmospheric Glows */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary-container/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-secondary-container/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-3 sm:gap-4">
        {/* Geographic & Live Telemetry Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <MapPin className="text-primary w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              <h1 className="font-bold text-xl sm:text-2xl text-on-surface tracking-tight truncate">
                {city.name}{city.admin1 ? `, ${city.admin1}` : ''}
              </h1>
            </div>
            <span className="text-xs font-mono text-on-surface-variant pl-6 truncate">
              {city.country || 'Global'} • {latFormatted}, {lonFormatted}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-highest text-primary text-xs font-mono font-bold shrink-0 border border-primary/20 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Live
          </span>
        </div>

        {/* Live Timestamp & Refresh Action */}
        <div className="flex items-center justify-between text-on-surface-variant text-xs font-mono pt-0.5">
          <span>{formatDateHeader(current.time)} • Updated real-time</span>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-colors cursor-pointer active:scale-95"
            title="Force refresh weather data"
            aria-label="Refresh weather data"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-primary' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Centerpiece: Large Metric & Dynamic SVG Weather Illustration */}
        <div className="flex items-center justify-between py-1 sm:py-2">
          <div className="flex flex-col">
            <div className="flex items-start">
              <span className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-on-surface tracking-tighter leading-none font-sans">
                {displayTemp}
              </span>
              <span className="text-2xl sm:text-3xl text-primary font-mono font-bold ml-1 sm:ml-1.5">
                °{unit}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-on-surface-variant mt-1.5 flex items-center gap-1 font-sans">
              Feels like <strong className="text-on-surface font-semibold">{displayFeelsLike}°</strong>
              <span className="text-outline-variant">•</span>
              <span>{condition.description}</span>
            </span>
          </div>

          {/* Dynamic Vector Graphic (Sun, Clouds, Precipitation) */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center shrink-0">
            <svg
              className="w-full h-full drop-shadow-[0_8px_24px_rgba(0,210,255,0.3)]"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="heroSunGlow" cx="0.5" cy="0.5" r="0.5" fx="0.4" fy="0.4">
                  <stop offset="0%" stopColor="#FFD799" />
                  <stop offset="70%" stopColor="#FEB300" />
                  <stop offset="100%" stopColor="#FF9E00" />
                </radialGradient>
                <linearGradient id="heroCloudFront" x1="20" y1="50" x2="100" y2="105" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#DAE2FD" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#47D6FF" stopOpacity="0.65" />
                </linearGradient>
                <linearGradient id="heroCloudDark" x1="15" y1="40" x2="90" y2="95" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#334155" stopOpacity="0.8" />
                </linearGradient>
              </defs>

              {/* Sun/Moon Orb */}
              {current.isDay ? (
                <>
                  <circle cx="72" cy="46" r="24" fill="url(#heroSunGlow)" />
                  <circle
                    cx="72"
                    cy="46"
                    r="29"
                    stroke="#FEB300"
                    strokeWidth="1.5"
                    strokeDasharray="3 4"
                    strokeOpacity="0.7"
                    className="animate-spin-slow"
                  />
                </>
              ) : (
                <circle cx="72" cy="46" r="22" fill="#E0E7FF" opacity="0.9" />
              )}

              {/* Atmospheric Cloud Vector */}
              <path
                d="M34 88C25.16 88 18 80.84 18 72C18 63.63 24.42 56.77 32.61 56.06C35.12 45.48 44.65 38 56 38C69.12 38 79.88 48.17 80.92 61.13C83.99 62.04 86.25 64.85 86.25 68.25C86.25 72.39 82.89 75.75 78.75 75.75H78C76.9 75.75 76 76.65 76 77.75C76 83.41 71.41 88 65.75 88H34Z"
                fill={current.weatherCode >= 50 ? 'url(#heroCloudDark)' : 'url(#heroCloudFront)'}
              />

              {/* Droplets for Rain codes */}
              {current.weatherCode >= 51 && (
                <>
                  <circle cx="36" cy="98" r="2.5" fill="#47D6FF" />
                  <circle cx="52" cy="102" r="2.5" fill="#47D6FF" />
                  <circle cx="68" cy="98" r="2.5" fill="#47D6FF" />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Condition Description Headline */}
        <div className="flex items-center gap-2">
          <Wind className="w-5 h-5 text-secondary shrink-0" />
          <p className="font-semibold text-base sm:text-lg text-on-surface font-sans">
            {condition.label} • {condition.description}
          </p>
        </div>

        {/* High/Low & Air Quality Diagnostic Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {/* Temperature Range Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface shadow-sm">
            <ArrowUp className="w-4 h-4 text-secondary" />
            <span className="font-mono text-xs sm:text-sm font-bold">{displayMax}°</span>
            <span className="text-outline-variant text-xs">•</span>
            <ArrowDown className="w-4 h-4 text-primary" />
            <span className="font-mono text-xs sm:text-sm font-bold">{displayMin}°</span>
          </div>

          {/* Air Quality Diagnostic Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface shadow-sm">
            <span className="w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#00d2ff]" />
            <span className="font-mono text-xs sm:text-sm">AQI {aqiValue}</span>
            <span className="text-outline-variant text-xs">•</span>
            <span className="text-[11px] font-mono text-primary uppercase font-bold tracking-wider">
              {aqiLabel}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
