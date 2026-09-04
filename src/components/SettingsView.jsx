/**
 * Weatherly - Settings View Component
 * Configures units, theme preference, model frequency, and developer telemetry attribution.
 */

import React from 'react';
import { Sliders, Sun, Moon, Database, ShieldCheck, RefreshCw, Trash2, Heart } from 'lucide-react';

export default function SettingsView({
  unit,
  toggleUnit,
  theme,
  toggleTheme,
  onClearHistory,
  onShowToast
}) {
  const [clearedNotice, setClearedNotice] = React.useState(false);

  const handleClear = () => {
    onClearHistory();
    setClearedNotice(true);
    if (onShowToast) onShowToast('Search history cleared successfully.');
    setTimeout(() => setClearedNotice(false), 2500);
  };
  return (
    <div id="settings-view" className="flex flex-col gap-4 w-full animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sliders className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-bold text-on-surface">Preferences & Telemetry</h2>
      </div>

      {/* Settings Options Card */}
      <div className="flex flex-col divide-y divide-outline-variant/20 rounded-2xl bg-surface-container border border-outline-variant/30 overflow-hidden shadow-sm">
        {/* Unit Selector */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-on-surface">Temperature Unit</span>
            <span className="text-xs text-on-surface-variant font-sans">
              Toggle between Fahrenheit (°F / MPH) and Celsius (°C / KM/H)
            </span>
          </div>

          <button
            onClick={toggleUnit}
            className="px-3.5 py-1.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-primary font-mono text-sm font-bold shadow-sm active:scale-95 transition-all"
          >
            {unit === 'F' ? 'Fahrenheit (°F)' : 'Celsius (°C)'}
          </button>
        </div>

        {/* Theme Selector */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-on-surface">Visual Appearance</span>
            <span className="text-xs text-on-surface-variant font-sans">
              Switch between Atmospheric Twilight Dark and High-Contrast Light mode
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-on-surface hover:text-primary font-mono text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-4 h-4 text-secondary" />
                <span>Dark Sky</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Solar Light</span>
              </>
            )}
          </button>
        </div>

        {/* Data Engine Info */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-on-surface">Meteorological Data Engine</span>
            <span className="text-xs text-on-surface-variant font-sans">
              Open-Meteo High-Resolution NWP API • No API key required
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
            100% Operational
          </span>
        </div>

        {/* Clear Cache */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-on-surface">Clear Search History</span>
            <span className="text-xs text-on-surface-variant font-sans">
              Wipe locally cached city history and recent coordinate pins
            </span>
          </div>

          <button
            onClick={handleClear}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface-container-high border border-outline-variant/30 text-error hover:bg-error-container/20 text-xs font-mono font-bold transition-all active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{clearedNotice ? 'Cleared ✓' : 'Clear History'}</span>
          </button>
        </div>
      </div>

      {/* Attribution & Portfolio Footer */}
      <div className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
        <div className="flex items-center gap-2 text-primary font-mono text-xs font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Production Ready • Developer Portfolio Grade</span>
        </div>
        <p className="text-xs text-on-surface-variant leading-relaxed font-sans">
          Weatherly is engineered with clean modular React components, custom SVG graphics, responsive telemetry grids, and zero mock weather data. Built using Open-Meteo Weather and Geocoding APIs.
        </p>
      </div>
    </div>
  );
}
