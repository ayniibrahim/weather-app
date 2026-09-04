/**
 * Weatherly - Production Skeleton Loading State Component
 * Recreates the exact telemetry uplink banner, rotating atmospheric feed status,
 * and high-fidelity skeleton cards matching the dashboard hierarchy.
 */

import React, { useState, useEffect } from 'react';
import { RotateCw } from 'lucide-react';

export default function LoadingState({ targetCity = 'Target Coordinates' }) {
  const stages = [
    'Live telemetry connecting to satellite feed...',
    'Resolving isobaric surface coordinates...',
    'Parsing doppler precipitation clusters...',
    'Synthesizing micro-climate thermal curve...'
  ];

  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % stages.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [stages.length]);

  return (
    <div id="weather-loading-skeleton" className="flex flex-col gap-4 w-full animate-fadeIn">
      {/* Active Telemetry Status & Uplink Banner */}
      <div className="w-full relative overflow-hidden rounded-xl bg-surface-container p-3.5 border border-outline-variant/30 shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-surface-container-high shrink-0">
            <RotateCw className="w-4 h-4 text-primary animate-spin" />
            <span className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <p className="text-xs font-mono text-primary uppercase tracking-wider truncate font-bold">
                Telemetry Uplink Active
              </p>
            </div>
            <p className="text-xs text-on-surface-variant truncate font-sans">
              Fetching meteorological data for{' '}
              <span className="text-on-surface font-semibold font-mono">
                {targetCity}
              </span>
              ...
            </p>
          </div>

          <div className="h-6 px-2.5 rounded-full bg-surface-container-highest border border-secondary/30 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-mono text-secondary font-bold">
              SYN-94%
            </span>
          </div>
        </div>

        {/* Shimmer linear track */}
        <div className="absolute bottom-0 inset-x-0 h-0.5 bg-surface-container-highest overflow-hidden">
          <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse" />
        </div>
      </div>

      {/* Hero Weather Skeleton Card */}
      <div className="relative w-full overflow-hidden rounded-2xl bg-surface-container-low/90 p-5 border border-outline-variant/30 shadow-lg flex flex-col gap-4">
        {/* Atmospheric Ambient Glow Overlay */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-secondary/5 rounded-full blur-2xl pointer-events-none" />

        {/* Header Skeleton */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2 w-3/5">
            <div className="h-6 w-3/4 rounded-md bg-surface-variant/80 animate-pulse" />
            <div className="h-3 w-1/2 rounded bg-surface-variant/50 animate-pulse" />
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-variant/60 animate-pulse shrink-0" />
        </div>

        {/* Centerpiece: Large Temperature + Icon Skeleton */}
        <div className="flex items-center justify-between py-2">
          <div className="flex flex-col gap-2">
            <div className="h-14 w-36 rounded-xl bg-surface-variant/90 animate-pulse" />
            <div className="h-4 w-28 rounded bg-surface-variant/50 animate-pulse" />
          </div>
          {/* Weather Icon Orbital Placeholder */}
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-surface-container-high/80 animate-pulse shrink-0 border border-outline-variant/30">
            <div className="w-12 h-12 rounded-full bg-surface-variant" />
          </div>
        </div>

        {/* Pill Chips Skeleton */}
        <div className="flex flex-wrap gap-2 pt-1">
          <div className="h-7 w-24 rounded-full bg-surface-container-highest animate-pulse" />
          <div className="h-7 w-28 rounded-full bg-surface-container-highest animate-pulse" />
        </div>
      </div>

      {/* Hourly Forecast Skeleton Track */}
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between px-1">
          <div className="h-3.5 w-28 rounded bg-surface-variant/60 animate-pulse" />
          <div className="h-3 w-16 rounded bg-surface-variant/40 animate-pulse" />
        </div>

        <div className="flex items-center gap-2.5 overflow-x-hidden w-full py-0.5">
          {[1, 2, 3, 4, 5, 6].map((key) => (
            <div
              key={key}
              className="flex-1 min-w-[76px] flex flex-col items-center justify-between p-3 h-28 rounded-xl bg-surface-container-low border border-outline-variant/20 shadow-sm animate-pulse"
            >
              <div className="h-3 w-8 rounded bg-surface-variant/80" />
              <div className="w-7 h-7 rounded-full bg-surface-variant" />
              <div className="h-4 w-7 rounded bg-surface-variant/90" />
            </div>
          ))}
        </div>
      </div>

      {/* 7-Day Outlook Skeleton */}
      <div className="w-full rounded-2xl bg-surface-container-low/90 p-5 border border-outline-variant/30 shadow-md flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-36 rounded bg-surface-variant/70 animate-pulse" />
          <div className="h-3 w-14 rounded bg-surface-variant/40 animate-pulse" />
        </div>

        <div className="flex flex-col gap-2.5 pt-1">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="flex items-center justify-between gap-3">
              <div className="w-12 h-3.5 rounded bg-surface-variant/80 animate-pulse shrink-0" />
              <div className="w-6 h-6 rounded-full bg-surface-variant animate-pulse shrink-0" />
              <div className="flex-1 flex items-center gap-2">
                <div className="w-7 h-3 rounded bg-surface-variant/50 animate-pulse" />
                <div className="flex-1 h-2 rounded-full bg-surface-container-highest overflow-hidden">
                  <div className="w-2/3 h-full bg-surface-variant rounded-full animate-pulse" />
                </div>
                <div className="w-7 h-3 rounded bg-surface-variant/70 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Telemetry Metrics Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 w-full">
        {[1, 2, 3, 4].map((box) => (
          <div
            key={box}
            className="rounded-2xl bg-surface-container-low p-4 border border-outline-variant/20 shadow-sm flex flex-col justify-between h-28 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="h-3 w-16 rounded bg-surface-variant/70" />
              <div className="w-5 h-5 rounded-full bg-surface-variant" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-6 w-16 rounded bg-surface-variant/90" />
              <div className="h-2 w-24 rounded bg-surface-variant/40" />
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Status Ticker Footer */}
      <div className="w-full py-2 flex flex-col items-center justify-center gap-1 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-outline-variant/30 shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container" />
          </span>
          <span className="text-xs font-mono text-on-surface-variant transition-opacity duration-300">
            {stages[stageIndex]}
          </span>
        </div>
        <p className="text-[11px] font-mono text-outline">
          EUMETSAT MSG-4 • POLARIS-NEXRAD CLUSTER
        </p>
      </div>
    </div>
  );
}
