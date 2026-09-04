/**
 * Weatherly - Recent Searches Component
 * Displays recent search history cards with live temperature indicators, quick deletion, and history clearing.
 */

import React from 'react';
import { History, X, MapPin, CloudRain, Sun, Cloud } from 'lucide-react';
import { getWeatherCondition, convertTemperature } from '../utils/weatherUtils.js';

export default function RecentSearches({
  recentSearches = [],
  onSelectCity,
  onRemoveCity,
  onClearHistory,
  unit = 'C'
}) {
  if (!recentSearches || recentSearches.length === 0) {
    return null;
  }

  return (
    <section id="recent-searches-list" className="flex flex-col gap-2.5 w-full">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <History className="w-4 h-4 text-outline" />
          <h3 className="font-semibold text-sm sm:text-base text-on-surface">
            Recent Searches
          </h3>
        </div>

        <button
          onClick={onClearHistory}
          className="text-xs font-mono text-outline hover:text-error transition-colors px-2 py-0.5 rounded active:scale-95"
          title="Remove all saved search history"
        >
          Clear History
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {recentSearches.map((city, idx) => {
          const condition = getWeatherCondition(city.weatherCode || 0, 1);
          const Icon = condition.Icon;
          const displayTemp = city.temperature !== null && city.temperature !== undefined
            ? convertTemperature(city.temperature, unit)
            : null;

          return (
            <div
              key={`${city.name}-${city.countryCode}-${idx}`}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-container/80 backdrop-blur-md border border-outline-variant/20 hover:border-primary/40 hover:bg-surface-container-high transition-all group"
            >
              <button
                type="button"
                onClick={() => onSelectCity(city)}
                className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                    {city.name}{city.admin1 ? `, ${city.admin1}` : ''}
                  </span>
                  <span className="text-xs font-mono text-on-surface-variant/80">
                    {city.country || 'Global'}
                    {displayTemp !== null && ` • ${displayTemp}°${unit}`}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCity(city.name);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-highest transition-colors ml-2 shrink-0"
                aria-label={`Remove ${city.name} from recent searches`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
