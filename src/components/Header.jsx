/**
 * Weatherly - Atmospheric Header Component
 * Recreates the exact brand header with Logo, PRO badge, unit toggle, location button, theme switch & avatar.
 */

import React from 'react';
import { Navigation, Moon, Sun, RefreshCw, Radio } from 'lucide-react';

export default function Header({
  theme,
  toggleTheme,
  unit,
  toggleUnit,
  onCurrentLocation,
  isLoading,
  onRefresh
}) {
  return (
    <header
      id="weatherly-header"
      className="fixed top-0 inset-x-0 z-50 bg-surface/85 backdrop-blur-xl pt-safe shadow-[0_1px_8px_rgba(0,0,0,0.35)] border-b border-outline-variant/20 transition-colors"
    >
      <div className="max-w-7xl mx-auto h-16 px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none" onClick={onRefresh}>
          {/* Custom Weatherly Brand Mark (Sun, Cloud & Droplets SVG) */}
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center">
            <svg
              className="w-full h-full drop-shadow-[0_2px_8px_rgba(0,210,255,0.4)]"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <radialGradient id="headerSunGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFDEAC" />
                  <stop offset="60%" stopColor="#FEB300" />
                  <stop offset="100%" stopColor="#FF9E00" />
                </radialGradient>
                <linearGradient id="headerCloudGrad" x1="10%" y1="10%" x2="90%" y2="90%">
                  <stop offset="0%" stopColor="#47D6FF" />
                  <stop offset="100%" stopColor="#0080B8" />
                </linearGradient>
              </defs>
              {/* Sun Orb */}
              <circle cx="68" cy="40" r="22" fill="url(#headerSunGlow)" />
              {/* Pulsing Sun Ray Ring */}
              <circle
                cx="68"
                cy="40"
                r="26"
                stroke="#FEB300"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                opacity="0.75"
              />
              {/* Cloud Contour */}
              <path
                d="M30 76C21.16 76 14 68.84 14 60C14 51.56 20.48 44.66 28.78 43.94C31.28 33.36 40.82 26 52.18 26C65.3 26 76.06 36.16 77.1 49.12C80.18 50.04 82.44 52.84 82.44 56.24C82.44 60.38 79.08 63.74 74.94 63.74H74.2C73.1 63.74 72.2 64.64 72.2 65.74C72.2 71.4 67.6 76 61.94 76H30Z"
                fill="url(#headerCloudGrad)"
              />
              {/* Rain Droplets */}
              <circle cx="34" cy="85" r="3" fill="#47D6FF" />
              <circle cx="48" cy="88" r="3" fill="#47D6FF" />
              <circle cx="62" cy="85" r="3" fill="#47D6FF" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg sm:text-xl text-on-surface tracking-tight font-sans">
                Weatherly
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary text-[10px] font-mono uppercase tracking-wider font-bold border border-secondary/30">
                PRO
              </span>
            </div>
            <span className="text-[11px] font-mono text-primary tracking-wide">
              Atmospheric Dashboard
            </span>
          </div>
        </div>

        {/* Header Right Utility Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Temperature Unit Switcher (°F / °C) */}
          <button
            id="unit-toggle-btn"
            onClick={toggleUnit}
            className="h-9 px-2.5 sm:px-3 rounded-lg bg-surface-container-high/70 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest border border-outline-variant/30 text-xs font-mono font-bold transition-all flex items-center gap-1 shadow-sm active:scale-95"
            title={`Switch to °${unit === 'F' ? 'C' : 'F'}`}
            aria-label={`Temperature unit currently Fahrenheit ${unit}. Click to switch to Celsius.`}
          >
            <span className={unit === 'F' ? 'text-primary font-bold' : 'text-on-surface-variant/70'}>°F</span>
            <span className="text-outline-variant">|</span>
            <span className={unit === 'C' ? 'text-primary font-bold' : 'text-on-surface-variant/70'}>°C</span>
          </button>

          {/* Location Button */}
          <button
            id="header-location-btn"
            onClick={onCurrentLocation}
            disabled={isLoading}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-surface-container-high/70 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest border border-outline-variant/30 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Locate Current Position (GPS)"
            aria-label="Use Current GPS Location"
          >
            <Navigation className={`w-4 h-4 sm:w-5 sm:h-5 ${isLoading ? 'animate-spin text-primary' : ''}`} />
          </button>

          {/* Theme Toggle (Dark / Light) */}
          <button
            id="header-theme-btn"
            onClick={toggleTheme}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-surface-container-high/70 text-on-surface-variant hover:text-primary hover:bg-surface-container-highest border border-outline-variant/30 transition-all shadow-sm active:scale-95"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle visual theme"
          >
            {theme === 'dark' ? (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
            ) : (
              <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            )}
          </button>

          {/* Profile Avatar */}
          <div className="pl-1 sm:pl-2 flex items-center">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full ring-2 ring-primary/40 shadow-sm overflow-hidden bg-surface-container-highest flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Meteorologist User Profile"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
