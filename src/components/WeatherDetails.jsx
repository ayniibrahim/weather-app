/**
 * Weatherly - Comprehensive Telemetry Details Grid & Radar Teaser
 * Renders 6 atmospheric metrics: Humidity, Wind Flow, UV Index, Pressure, Visibility, and Sun Cycle,
 * plus the Live Doppler Loop radar banner.
 */

import React from 'react';
import {
  Droplets,
  Compass,
  Sun,
  Gauge,
  Eye,
  Sunset,
  Navigation,
  ArrowRight,
  MoveRight,
  Radio
} from 'lucide-react';
import {
  convertTemperature,
  convertWindSpeed,
  convertVisibility,
  getWindDirection,
  getUVCategory,
  getPressureTrend,
  formatTime
} from '../utils/weatherUtils.js';

export default function WeatherDetails({
  weatherData,
  unit = 'C',
  onOpenRadar
}) {
  if (!weatherData) return null;

  const current = weatherData.current;
  const dailySummary = weatherData.dailySummary;

  // 1. Humidity & Dew Point
  const humidity = current.humidity ?? current.relativeHumidity ?? 60;
  const dewPoint = convertTemperature(current.dewPoint, unit);

  // 2. Wind Flow & Azimuth
  const windSpeed = convertWindSpeed(current.windSpeed, unit);
  const windUnit = unit === 'F' ? 'MPH' : 'KM/H';
  const cardinalDir = getWindDirection(current.windDirection);
  const windAngle = current.windDirection ?? 0;
  const numericWind = typeof windSpeed === 'number' ? windSpeed : Number(windSpeed) || 0;
  const estimatedGusts = Math.round(numericWind * 1.35);

  // 3. UV Index
  const uvCategory = getUVCategory(current.uvIndex);
  const uvPercent = Math.min(100, Math.round((current.uvIndex / 11) * 100));

  // 4. Barometric Pressure
  const pressure = current.pressure || 1013;
  const pressureTrend = getPressureTrend(pressure);

  // 5. Visibility
  const vis = convertVisibility(current.visibility, unit);

  // 6. Sun Cycle Times & Sun Arc Position
  const sunriseTime = formatTime(dailySummary?.sunrise) || '6:45 AM';
  const sunsetTime = formatTime(dailySummary?.sunset) || '6:30 PM';

  // Calculate position along solar arc (0 to 1) based on current hour
  let sunProgress = 0.55;
  if (dailySummary?.sunrise && dailySummary?.sunset) {
    const riseMs = new Date(dailySummary.sunrise).getTime();
    const setMs = new Date(dailySummary.sunset).getTime();
    const nowMs = Date.now();
    if (!isNaN(riseMs) && !isNaN(setMs) && setMs > riseMs) {
      if (nowMs <= riseMs) sunProgress = 0.05;
      else if (nowMs >= setMs) sunProgress = 0.95;
      else {
        const ratio = (nowMs - riseMs) / (setMs - riseMs);
        sunProgress = Math.max(0.05, Math.min(0.95, isFinite(ratio) ? ratio : 0.55));
      }
    }
  }

  if (!isFinite(sunProgress) || isNaN(sunProgress)) {
    sunProgress = 0.55;
  }

  // Calculate SVG arc coordinates for the sun marker (arc width: 100, height: 40)
  // Arc angle from 180 to 0 degrees:
  const angleRad = Math.PI - (sunProgress * Math.PI);
  const calcX = 50 + 40 * Math.cos(angleRad);
  const calcY = 38 - 30 * Math.sin(angleRad);
  const cx = isFinite(calcX) ? calcX : 50;
  const cy = isFinite(calcY) ? calcY : 20;

  return (
    <div id="weather-details-section" className="flex flex-col gap-4 w-full">
      {/* 6-Card Bento Telemetry Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 w-full">
        {/* 1. Humidity Card */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-sm hover:shadow-md hover:border-primary/40 transition-all min-h-[160px]">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-mono uppercase tracking-wider">Humidity</span>
            <Droplets className="w-4 h-4 text-primary" />
          </div>

          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-on-surface">
              {humidity}%
            </span>
          </div>

          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-primary h-full rounded-full transition-all duration-500"
              style={{ width: `${humidity}%` }}
            />
          </div>

          <span className="text-xs text-on-surface-variant font-sans">
            Dew point: <strong className="text-on-surface font-semibold">{dewPoint}°</strong>
          </span>
        </div>

        {/* 2. Wind Flow Card */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-sm hover:shadow-md hover:border-primary/40 transition-all min-h-[160px]">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-mono uppercase tracking-wider">Wind Flow</span>
            <Compass className="w-4 h-4 text-primary" />
          </div>

          <div className="flex items-center gap-2 my-2">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-on-surface">
              {windSpeed}
            </span>
            <span className="text-xs font-mono text-on-surface-variant font-bold">
              {windUnit} {cardinalDir}
            </span>

            {/* Rotating Needle Vector */}
            <div
              className="w-7 h-7 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-primary shadow-xs transition-transform duration-700 ml-auto"
              style={{ transform: `rotate(${windAngle}deg)` }}
              title={`Bearing: ${windAngle}°`}
            >
              <Navigation className="w-3.5 h-3.5 fill-current" />
            </div>
          </div>

          <span className="text-xs text-on-surface-variant font-sans">
            Gusts to {estimatedGusts} {windUnit.toLowerCase()}
          </span>
        </div>

        {/* 3. UV Index Card */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-sm hover:shadow-md hover:border-primary/40 transition-all min-h-[160px]">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-mono uppercase tracking-wider">UV Index</span>
            <Sun className="w-4 h-4 text-secondary" />
          </div>

          <div className="my-2 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-on-surface">
              {current.uvIndex}
            </span>
            <span className={`text-xs font-mono font-semibold ${uvCategory.color}`}>
              {uvCategory.label}
            </span>
          </div>

          {/* Spectral Range Bar */}
          <div className="w-full h-1.5 rounded-full bg-gradient-to-r from-primary via-secondary to-rose-500 mb-1.5 relative">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md border border-slate-900"
              style={{ left: `${uvPercent}%` }}
            />
          </div>

          <span className="text-xs text-on-surface-variant font-sans truncate" title={uvCategory.advisory}>
            {uvCategory.advisory}
          </span>
        </div>

        {/* 4. Barometric Pressure Card */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-sm hover:shadow-md hover:border-primary/40 transition-all min-h-[160px]">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-mono uppercase tracking-wider">Pressure</span>
            <Gauge className="w-4 h-4 text-primary" />
          </div>

          <div className="my-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-on-surface">
              {pressure}
            </span>
            <span className="text-xs font-mono text-on-surface-variant">hPa</span>
          </div>

          <div className="flex items-center gap-1 text-primary text-xs font-mono font-semibold">
            <MoveRight className="w-3.5 h-3.5" />
            <span>{pressureTrend.label}</span>
          </div>

          <span className="text-xs text-on-surface-variant font-sans truncate" title={pressureTrend.note}>
            {pressureTrend.note}
          </span>
        </div>

        {/* 5. Visibility Card */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-sm hover:shadow-md hover:border-primary/40 transition-all min-h-[160px]">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-mono uppercase tracking-wider">Visibility</span>
            <Eye className="w-4 h-4 text-primary" />
          </div>

          <div className="my-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-on-surface">
              {vis.value}
            </span>
            <span className="text-xs font-mono text-on-surface-variant font-bold">
              {vis.unit}
            </span>
          </div>

          <span className="text-xs text-on-surface-variant font-sans">
            Clear celestial horizon
          </span>
        </div>

        {/* 6. Sun Cycle Card */}
        <div className="flex flex-col justify-between p-4 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-sm hover:shadow-md hover:border-primary/40 transition-all min-h-[160px]">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-[11px] font-mono uppercase tracking-wider">Sun Cycle</span>
            <Sunset className="w-4 h-4 text-secondary" />
          </div>

          {/* Miniature Solar Arc Vector */}
          <div className="w-full h-8 my-1 flex items-center justify-center">
            <svg className="w-24 h-full overflow-visible" viewBox="0 0 100 40" fill="none">
              {/* Background Arc */}
              <path
                d="M 10 38 A 40 30 0 0 1 90 38"
                stroke="#3C494E"
                strokeDasharray="3 3"
                strokeWidth="2"
              />
              {/* Active Sun Progress Arc */}
              <path
                d="M 10 38 A 40 30 0 0 1 90 38"
                stroke="#FFD799"
                strokeWidth="2.5"
                strokeDasharray="125"
                strokeDashoffset={125 * (1 - sunProgress)}
              />
              {/* Moving Sun Orb Marker */}
              <circle cx={cx} cy={cy} r="4" fill="#FFB300" className="shadow-lg animate-pulse" />
            </svg>
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <div className="flex flex-col">
              <span className="text-on-surface-variant text-[10px]">Rise</span>
              <span className="text-on-surface font-semibold text-[11px]">{sunriseTime}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-on-surface-variant text-[10px]">Set</span>
              <span className="text-secondary font-semibold text-[11px]">{sunsetTime}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Radar Teaser & Interactive Quick-launch Bento Card */}
      <section
        id="doppler-radar-banner"
        className="w-full rounded-2xl bg-surface-container border border-outline-variant/40 p-4 shadow-sm hover:shadow-md hover:border-primary/40 flex items-center justify-between transition-all cursor-pointer group"
        onClick={onOpenRadar}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container/15 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base text-on-surface">
              Live Doppler Radar Loop
            </span>
            <span className="text-xs font-mono text-on-surface-variant">
              No precipitation fronts within 45 mi radius
            </span>
          </div>
        </div>

        <button
          type="button"
          className="px-3.5 py-1.5 rounded-xl bg-surface-container-high border border-outline-variant/40 text-primary text-xs font-mono font-semibold flex items-center gap-1 group-hover:bg-primary-container group-hover:text-on-primary-container transition-all"
        >
          <span>Expand</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </section>
    </div>
  );
}
