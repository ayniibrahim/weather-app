/**
 * Weatherly - 24-Hour Trajectory Component
 * Horizontally scrollable hourly forecast carousel highlighting the current hour,
 * dynamic condition icons, temperatures, and rain probability.
 */

import React from 'react';
import { Clock } from 'lucide-react';
import {
  getWeatherCondition,
  convertTemperature,
  formatHourOnly
} from '../utils/weatherUtils.js';

export default function HourlyForecast({
  hourlyData = [],
  unit = 'C',
  sunsetTime
}) {
  if (!hourlyData || hourlyData.length === 0) return null;

  return (
    <section
      id="hourly-trajectory"
      className="rounded-2xl bg-surface-container border border-outline-variant/40 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 w-full"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h2 className="font-bold text-base sm:text-lg text-on-surface">
            24-Hour Trajectory
          </h2>
        </div>
        <span className="text-xs font-mono text-on-surface-variant">
          Wind & Rain Prob
        </span>
      </div>

      {/* Horizontal Carousel Track */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 pt-1 no-scrollbar snap-x snap-mandatory select-none">
        {hourlyData.map((hour, idx) => {
          const isNow = hour.isCurrent || idx === 0;
          const condition = getWeatherCondition(hour.weatherCode, 1);
          const Icon = condition.Icon;
          const displayTemp = convertTemperature(hour.temperature, unit);

          // Format time string
          let timeLabel = isNow ? 'Now' : formatHourOnly(hour.time);

          return (
            <div
              key={`${hour.time}-${idx}`}
              className={`flex flex-col items-center justify-between p-3 rounded-xl min-w-[78px] sm:min-w-[84px] shrink-0 snap-start transition-all ${
                isNow
                  ? 'bg-surface-container-high ring-1 ring-primary/50 shadow-sm border border-primary/30'
                  : 'bg-surface-container-low border border-outline-variant/30 hover:bg-surface-container-high/60 shadow-xs'
              }`}
            >
              {/* Time Label */}
              <span
                className={`text-xs font-mono ${
                  isNow ? 'text-primary font-bold' : 'text-on-surface-variant'
                }`}
              >
                {timeLabel}
              </span>

              {/* Weather Icon */}
              <div className="my-2 text-secondary">
                <Icon className={`w-6 h-6 ${condition.color}`} />
              </div>

              {/* Temperature */}
              <span className="text-base sm:text-lg font-bold text-on-surface font-mono">
                {displayTemp}°
              </span>

              {/* Precipitation Probability */}
              <span
                className={`text-[11px] font-mono mt-1 ${
                  hour.rainProbability > 20
                    ? 'text-primary font-semibold'
                    : 'text-on-surface-variant/70'
                }`}
              >
                {hour.rainProbability}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
