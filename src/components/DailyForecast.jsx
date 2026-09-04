/**
 * Weatherly - 7-Day Atmospheric Outlook Component
 * Recreates the 7-day forecast table with day label, condition icon, condition text,
 * min temperature, color gradient range bar, and max temperature.
 */

import React from 'react';
import { Calendar, ChevronRight } from 'lucide-react';
import {
  getWeatherCondition,
  convertTemperature,
  formatDayName
} from '../utils/weatherUtils.js';

export default function DailyForecast({
  dailyData = [],
  unit = 'C',
  onExtend
}) {
  if (!dailyData || dailyData.length === 0) return null;

  // Compute global minimum and maximum across the 7 days for normalized gradient bars
  let globalMin = Infinity;
  let globalMax = -Infinity;

  dailyData.forEach((day) => {
    if (day.tempMin < globalMin) globalMin = day.tempMin;
    if (day.tempMax > globalMax) globalMax = day.tempMax;
  });

  const rangeSpan = Math.max(1, globalMax - globalMin);

  return (
    <section
      id="daily-forecast"
      className="flex flex-col p-4 sm:p-5 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-sm hover:shadow-md transition-all gap-3.5 w-full h-full justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h2 className="font-bold text-base sm:text-lg text-on-surface">
            7-Day Forecast
          </h2>
        </div>

        <button
          onClick={onExtend}
          className="flex items-center gap-1 text-primary text-xs font-mono hover:underline active:scale-95 transition-all"
        >
          <span>Extended 14d</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Daily Rows */}
      <div className="flex flex-col gap-2">
        {dailyData.map((day, idx) => {
          const isToday = idx === 0;
          const condition = getWeatherCondition(day.weatherCode, 1);
          const Icon = condition.Icon;
          const minTemp = convertTemperature(day.tempMin, unit);
          const maxTemp = convertTemperature(day.tempMax, unit);
          const dayName = isToday ? 'Today' : formatDayName(day.date, idx);

          // Calculate percentage offsets for the gradient bar
          const leftPercent = Math.max(0, Math.min(85, Math.round(((day.tempMin - globalMin) / rangeSpan) * 100)));
          const widthPercent = Math.max(15, Math.min(100 - leftPercent, Math.round(((day.tempMax - day.tempMin) / rangeSpan) * 100)));

          return (
            <div
              key={`${day.date}-${idx}`}
              className={`flex items-center justify-between py-2 px-2.5 rounded-xl transition-colors ${
                isToday
                  ? 'bg-surface-container-high/60 border border-primary/20'
                  : 'hover:bg-surface-container-high/40'
              }`}
            >
              {/* Day Name */}
              <span
                className={`text-xs sm:text-sm font-mono font-bold w-12 sm:w-16 ${
                  isToday ? 'text-primary' : 'text-on-surface'
                }`}
              >
                {dayName}
              </span>

              {/* Weather Condition Icon & Name */}
              <div className="flex items-center gap-2 w-28 sm:w-36 min-w-0">
                <Icon className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${condition.color}`} />
                <span className="text-xs sm:text-sm text-on-surface truncate font-sans">
                  {condition.label}
                </span>
              </div>

              {/* Min Temp, Gradient Temperature Range Bar, Max Temp */}
              <div className="flex items-center gap-2 flex-1 max-w-[170px] sm:max-w-[200px]">
                {/* Low Temp */}
                <span className="text-xs font-mono text-on-surface-variant w-7 text-right">
                  {minTemp}°
                </span>

                {/* Range Bar */}
                <div className="relative flex-1 h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div
                    className="absolute top-0 bottom-0 rounded-full bg-gradient-to-r from-primary via-secondary to-secondary-container"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`
                    }}
                  />
                </div>

                {/* High Temp */}
                <span className="text-xs font-mono text-on-surface w-7 font-bold">
                  {maxTemp}°
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
