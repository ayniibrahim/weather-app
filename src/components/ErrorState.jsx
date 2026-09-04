/**
 * Weatherly - Comprehensive Error State Component
 * Recreates the 404 Geocoding card, diagnostic illustration, suggested closest matches,
 * GPS fallback, and signal troubleshooting gateway.
 */

import React from 'react';
import {
  SearchX,
  AlertTriangle,
  Navigation,
  Compass,
  Building2,
  Waves,
  Sun,
  ChevronRight,
  WifiOff,
  Router,
  Server,
  RotateCw,
  Satellite
} from 'lucide-react';

export default function ErrorState({
  errorMessage,
  failedQuery = '',
  onRetry,
  onCurrentLocation,
  onSelectSuggestion,
  onResetDefault,
  unit = 'C'
}) {
  const suggestions = [
    {
      name: 'Atlanta',
      country: 'United States',
      countryCode: 'US',
      admin1: 'GA',
      latitude: 33.749,
      longitude: -84.388,
      temp: unit === 'F' ? 72 : 22,
      Icon: Building2
    },
    {
      name: 'Atlantic City',
      country: 'United States',
      countryCode: 'US',
      admin1: 'NJ',
      latitude: 39.3643,
      longitude: -74.4229,
      temp: unit === 'F' ? 63 : 17,
      Icon: Waves
    },
    {
      name: 'Athens',
      country: 'Greece',
      countryCode: 'GR',
      latitude: 37.9838,
      longitude: 23.7275,
      temp: unit === 'F' ? 79 : 26,
      Icon: Sun
    }
  ];

  return (
    <div id="weather-error-state" className="flex flex-col gap-4 w-full animate-fadeIn">
      {/* Search Field Warning Alert Strip */}
      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-error-container/20 border border-error/40 text-error shadow-sm">
        <AlertTriangle className="w-4 h-4 shrink-0 text-error" />
        <span className="text-xs font-mono font-medium">
          {failedQuery ? `No telemetry records matched "${failedQuery}"` : 'No telemetry records matched this identifier'}
        </span>
      </div>

      {/* 404 Geocoding Diagnostic Card */}
      <section className="relative flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-surface-container-low/90 backdrop-blur-xl border border-outline-variant/30 shadow-xl overflow-hidden">
        {/* Ambient Backlight Flare */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-52 h-52 bg-error-container/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 right-0 w-40 h-40 bg-primary-container/10 rounded-full blur-2xl pointer-events-none" />

        {/* Illustrated Vector Graphic (Cloud with Search Radar Pin) */}
        <div className="relative w-32 h-32 mb-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-surface-container-high/60" />
          <div className="absolute inset-2 rounded-full bg-error-container/20 animate-ping opacity-60" />

          <svg
            className="relative w-20 h-20 text-on-surface"
            viewBox="0 0 80 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Cloud Contour */}
            <path
              d="M22 52C16.48 52 12 47.52 12 42C12 36.93 15.77 32.75 20.67 32.08C22.08 22.85 30.12 16 39.8 16C50.24 16 58.75 24.09 59.54 34.34C63.86 35.83 67 39.96 67 44.8C67 50.99 61.99 56 55.8 56H22"
              stroke="#859399"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="opacity-40"
            />
            {/* Radar Arc */}
            <path
              d="M48 26C54.63 29.5 58 35.5 58 42"
              stroke="#47D6FF"
              strokeWidth="2.5"
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
            {/* Magnifier Rim */}
            <circle cx="38" cy="42" r="14" stroke="#FFD799" strokeWidth="3.5" fill="#171F33" />
            <path d="M48 52L58 62" stroke="#FFD799" strokeWidth="3.5" strokeLinecap="round" />
            <text
              x="38"
              y="47"
              textAnchor="middle"
              fill="#FFD799"
              fontSize="16"
              fontWeight="700"
              fontFamily="'JetBrains Mono', monospace"
            >
              ?
            </text>
          </svg>

          {/* Diagnostic Badge */}
          <div className="absolute -bottom-1 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-mono text-[10px] uppercase font-bold tracking-wider shadow-md">
            404 Geocoding
          </div>
        </div>

        {/* Error Copy */}
        <h2 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight mb-1 font-sans">
          City Not Found
        </h2>
        <p className="text-sm font-semibold text-secondary max-w-sm mb-2 font-sans">
          {errorMessage || 'City not found. Please check the spelling and try again.'}
        </p>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm leading-relaxed mb-6 font-sans">
          Make sure the city name, state, or country code is spelled correctly, or try searching with postal code or GPS coordinates.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row w-full gap-2.5 sm:max-w-md">
          <button
            type="button"
            onClick={onCurrentLocation}
            className="w-full h-11 sm:h-12 flex items-center justify-center gap-2 rounded-xl bg-primary-container text-on-primary-container font-bold text-sm shadow-md active:scale-98 hover:brightness-110 transition-all cursor-pointer"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>Try Current Location</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSuggestion(suggestions[0])}
            className="w-full h-11 sm:h-12 flex items-center justify-center gap-2 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface hover:text-primary hover:border-primary/40 font-semibold text-sm active:scale-98 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-primary" />
            <span>Browse Popular Cities</span>
          </button>
        </div>
      </section>

      {/* Autocomplete Suggestions (Did you mean?) */}
      <section className="flex flex-col w-full gap-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-on-surface">Did you mean?</span>
          </div>
          <span className="text-xs font-mono text-on-surface-variant">Closest Matches</span>
        </div>

        <div className="flex flex-col gap-2">
          {suggestions.map((item) => {
            const Icon = item.Icon;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onSelectSuggestion(item)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-high/80 border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high text-on-surface transition-all active:scale-[0.99] cursor-pointer text-left group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-surface-container-highest border border-outline-variant/30 text-primary shrink-0 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-semibold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                      {item.name}, {item.admin1 || item.country}
                    </span>
                    <span className="text-xs font-mono text-on-surface-variant">
                      {item.latitude.toFixed(4)}° N, {Math.abs(item.longitude).toFixed(4)}° W
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-primary">
                    {item.temp}°{unit}
                  </span>
                  <ChevronRight className="w-4 h-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Troubleshooting & Signal Gateway Card */}
      <section className="flex flex-col w-full p-4 sm:p-5 rounded-xl bg-surface-container-low/90 border border-outline-variant/30 shadow-sm gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-full bg-secondary-container/20 text-secondary">
              <WifiOff className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm sm:text-base text-on-surface">
              Troubleshooting & Signal
            </h3>
          </div>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-highest text-[11px] font-mono text-on-surface-variant border border-outline-variant/20">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            Degraded
          </span>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
          If spelling is verified, this lookup anomaly may stem from localized network latency or satellite uplink limits.
        </p>

        <div className="grid grid-cols-1 gap-2 pt-1">
          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container border border-outline-variant/20">
            <Router className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface">Verify Cellular or Wi-Fi</span>
              <span className="text-[11px] font-mono text-on-surface-variant">Confirm packet flow or airplane mode toggle</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-container border border-outline-variant/20">
            <Server className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface">Telemetry Gateway Status</span>
              <span className="text-[11px] font-mono text-on-surface-variant">NOAA/Open-Meteo cluster response: 100% operational</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-surface-variant hover:bg-surface-bright text-on-surface font-mono text-xs uppercase tracking-wider font-bold transition-all active:scale-98 cursor-pointer mt-1"
        >
          <RotateCw className="w-3.5 h-3.5 text-primary" />
          <span>Retry Signal Connection</span>
        </button>
      </section>

      {/* Decorative Atmospheric Strip */}
      <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface-variant text-[11px] font-mono border border-outline-variant/20">
        <div className="flex items-center gap-1.5">
          <Satellite className="w-3.5 h-3.5 text-primary" />
          <span>GEOS-18 East</span>
        </div>
        <div>
          <span>Cached 4m ago</span>
        </div>
        <div className="text-primary font-bold">
          <span>GPS Ready</span>
        </div>
      </div>
    </div>
  );
}
