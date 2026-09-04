/**
 * Weatherly - Saved Cities View Component
 * Manages user's bookmarked meteorological stations and cities with live temperatures.
 */

import React from 'react';
import { Building2, Plus, Trash2, MapPin, ExternalLink } from 'lucide-react';
import { getWeatherCondition, convertTemperature } from '../utils/weatherUtils.js';

export default function SavedCitiesView({
  savedCities = [],
  onSelectCity,
  onRemoveCity,
  onAddCurrentCity,
  currentCity,
  unit = 'C'
}) {
  const isCurrentSaved = currentCity && savedCities.some(
    (c) => c.name.toLowerCase() === currentCity.name.toLowerCase()
  );

  return (
    <div id="saved-cities-view" className="flex flex-col gap-4 w-full animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-on-surface">Saved Hubs</h2>
        </div>

        {currentCity && !isCurrentSaved && (
          <button
            onClick={() => onAddCurrentCity(currentCity)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary-container text-on-primary-container text-xs font-mono font-bold hover:brightness-110 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Save {currentCity.name}</span>
          </button>
        )}
      </div>

      {/* List */}
      {savedCities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savedCities.map((city, idx) => {
            return (
              <div
                key={`${city.name}-${idx}`}
                className="flex items-center justify-between p-4 rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container-high transition-all group"
              >
                <button
                  type="button"
                  onClick={() => onSelectCity(city)}
                  className="flex items-center gap-3 min-w-0 flex-1 text-left cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-surface-container-highest border border-outline-variant/30 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                    <MapPin className="w-5 h-5" />
                  </div>

                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-base text-on-surface truncate group-hover:text-primary transition-colors">
                      {city.name}
                    </span>
                    <span className="text-xs font-mono text-on-surface-variant truncate">
                      {city.admin1 ? `${city.admin1}, ` : ''}{city.country || 'Global'}
                    </span>
                  </div>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectCity(city)}
                    className="p-2 rounded-lg text-primary hover:bg-surface-container-highest transition-colors"
                    title="Load weather"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveCity(city);
                    }}
                    className="p-2 rounded-lg text-outline hover:text-error hover:bg-surface-container-highest transition-colors"
                    title="Remove saved city"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/30 text-center flex flex-col items-center gap-2">
          <Building2 className="w-10 h-10 text-outline-variant mb-2" />
          <h3 className="font-bold text-base text-on-surface">No saved cities yet</h3>
          <p className="text-xs text-on-surface-variant max-w-xs font-sans">
            Bookmark your favorite cities or global hubs to quickly access their weather conditions here.
          </p>
          {currentCity && (
            <button
              onClick={() => onAddCurrentCity(currentCity)}
              className="mt-3 px-4 py-2 rounded-xl bg-surface-container-high border border-outline-variant/40 text-primary hover:text-white text-xs font-mono font-bold transition-all"
            >
              Bookmark {currentCity.name}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
