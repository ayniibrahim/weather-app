/**
 * Weatherly - Empty State Atmosphere Discovery Component
 * Recreates the exact radar globe empty state, popular hubs grid, and NOAA telemetry insight card.
 */

import React from 'react';
import {
  Navigation,
  Radio,
  TrendingUp,
  Sun,
  Moon,
  Cloud,
  Wind,
  Lightbulb,
  Satellite
} from 'lucide-react';
import RecentSearches from './RecentSearches.jsx';

export default function EmptyState({
  onCurrentLocation,
  onSelectCity,
  recentSearches = [],
  onRemoveCity,
  onClearHistory,
  unit = 'C',
  isLoading
}) {
  const popularHubs = [
    {
      name: 'New York',
      country: 'United States',
      countryCode: 'US',
      admin1: 'New York',
      latitude: 40.7128,
      longitude: -74.006,
      temp: unit === 'F' ? 64 : 18,
      condition: 'Sunny',
      Icon: Sun,
      color: 'text-secondary'
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      countryCode: 'JP',
      latitude: 35.6895,
      longitude: 139.6917,
      temp: unit === 'F' ? 66 : 19,
      condition: 'Clear',
      Icon: Moon,
      color: 'text-primary'
    },
    {
      name: 'Paris',
      country: 'France',
      countryCode: 'FR',
      latitude: 48.8566,
      longitude: 2.3522,
      temp: unit === 'F' ? 59 : 15,
      condition: 'Overcast',
      Icon: Cloud,
      color: 'text-outline'
    },
    {
      name: 'Sydney',
      country: 'Australia',
      countryCode: 'AU',
      latitude: -33.8688,
      longitude: 151.2093,
      temp: unit === 'F' ? 72 : 22,
      condition: 'Breezy',
      Icon: Wind,
      color: 'text-primary-container'
    }
  ];

  return (
    <div id="empty-state-view" className="flex flex-col gap-5 w-full">
      {/* 1. Atmospheric Discovery Card */}
      <section className="relative overflow-hidden rounded-2xl bg-surface-container-low/90 backdrop-blur-xl p-6 sm:p-8 border border-outline-variant/30 shadow-xl">
        {/* Ambient Glows */}
        <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-primary-container/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Radar Globe HUD Vector */}
          <div className="relative w-32 h-32 sm:w-36 sm:h-36 mb-4 flex items-center justify-center">
            {/* Pulse Echo Ring */}
            <div className="absolute inset-0 rounded-full bg-primary/10 animate-ping opacity-60" />
            <div className="absolute inset-2 rounded-full bg-surface-container-high/80 border border-outline-variant/40 shadow-inner flex items-center justify-center">
              {/* Radar HUD SVG */}
              <svg
                className="w-24 h-24 text-primary"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.2" />
                <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3" />
                <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
                <line x1="50" y1="6" x2="50" y2="94" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
                <line x1="6" y1="50" x2="94" y2="50" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25" />
                {/* Rotating Sweeper Cone */}
                <path d="M50 50 L84 20 A44 44 0 0 0 50 6 Z" fill="url(#emptyRadarSweep)" opacity="0.75" className="origin-center animate-spin-slow" />
                <circle cx="66" cy="38" r="3.5" fill="#00D2FF" opacity="0.9" />
                <circle cx="34" cy="62" r="3" fill="#FEB300" opacity="0.8" />
                <circle cx="68" cy="60" r="2.5" fill="#47D6FF" opacity="0.7" />
                <defs>
                  <linearGradient id="emptyRadarSweep" x1="50" y1="50" x2="80" y2="20" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Orbiting Live Radar Badge */}
            <div className="absolute top-1 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container/20 border border-secondary/30 text-secondary text-[10px] font-mono shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              <span>LIVE RADAR</span>
            </div>
          </div>

          {/* Headline & Description */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-on-surface tracking-tight mb-2 font-sans">
            Explore the Atmosphere
          </h2>
          <p className="text-sm text-on-surface-variant max-w-md mb-6 leading-relaxed font-sans">
            Search any global city or tap your current location to reveal real-time atmospheric telemetry, radar maps, and 7-day forecasts.
          </p>

          {/* Primary GPS Action Button */}
          <button
            onClick={onCurrentLocation}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-primary-container text-on-primary-container font-semibold rounded-xl text-sm sm:text-base shadow-[0_0_24px_rgba(0,210,255,0.35)] hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Navigation className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Use Current Location</span>
          </button>

          {/* Signal Monospace Feed */}
          <div className="mt-4 flex items-center gap-1.5 text-outline text-xs font-mono">
            <Satellite className="w-3.5 h-3.5" />
            <span>NOAA Geostationary • GOES-18 Active</span>
          </div>
        </div>
      </section>

      {/* 2. Popular Meteorological Hubs */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-secondary" />
            <h3 className="font-semibold text-sm sm:text-base text-on-surface">
              Popular Hubs
            </h3>
          </div>
          <span className="text-xs font-mono text-outline">GLOBAL TELEMETRY</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
          {popularHubs.map((hub) => {
            const Icon = hub.Icon;
            return (
              <button
                key={hub.name}
                type="button"
                onClick={() => onSelectCity(hub)}
                className="relative text-left p-3.5 sm:p-4 rounded-xl bg-surface-container border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high transition-all flex flex-col justify-between h-28 sm:h-32 shadow-sm group overflow-hidden cursor-pointer"
              >
                <div className="flex items-start justify-between w-full">
                  <div className="min-w-0 pr-1">
                    <span className="font-bold text-sm sm:text-base text-on-surface truncate block group-hover:text-primary transition-colors">
                      {hub.name}
                    </span>
                    <span className="text-xs font-mono text-on-surface-variant truncate block">
                      {hub.country}
                    </span>
                  </div>
                  <Icon className={`w-5 h-5 shrink-0 ${hub.color} group-hover:scale-110 transition-transform`} />
                </div>

                <div className="flex items-baseline justify-between w-full mt-auto">
                  <span className="text-xl sm:text-2xl font-mono font-bold text-primary">
                    {hub.temp}°{unit}
                  </span>
                  <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-surface-container-highest text-secondary border border-outline-variant/20">
                    {hub.condition}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Recent Searches (If present) */}
      {recentSearches.length > 0 && (
        <RecentSearches
          recentSearches={recentSearches}
          onSelectCity={onSelectCity}
          onRemoveCity={onRemoveCity}
          onClearHistory={onClearHistory}
          unit={unit}
        />
      )}

      {/* 4. Meteorology Insight Card */}
      <section className="relative overflow-hidden rounded-xl bg-surface-container/85 backdrop-blur-md p-4 border border-outline-variant/30 flex items-start gap-3 shadow-md">
        <div className="w-10 h-10 rounded-xl bg-secondary-container/20 border border-secondary/30 flex items-center justify-center text-secondary shrink-0">
          <Lightbulb className="w-5 h-5" />
        </div>

        <div className="flex flex-col min-w-0 pr-1">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[11px] font-mono text-secondary uppercase font-bold tracking-wider">
              Meteorology Insight
            </span>
            <span className="w-1 h-1 rounded-full bg-outline" />
            <span className="text-[11px] font-mono text-outline">v4.2</span>
          </div>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-sans">
            <strong className="text-on-surface font-semibold">Did you know?</strong> Weatherly delivers hyper-local radar updates with 99.4% NOAA model precision, tracking atmospheric convective currents at 60-second intervals.
          </p>
        </div>
      </section>
    </div>
  );
}
