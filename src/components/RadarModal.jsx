/**
 * Weatherly - Live Doppler Radar Modal & Interactive Map View
 * Real-time convective storm loop with rotating radar sweep, radar reflectivity dBZ legend,
 * time scrubber, and layer filters (Precipitation, Cloud Cover, Wind Stream).
 */

import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Radio, Layers, ZoomIn, ZoomOut, Compass, RefreshCw } from 'lucide-react';

export default function RadarModal({
  isOpen,
  onClose,
  city,
  weatherData
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeLayer, setActiveLayer] = useState('precipitation'); // 'precipitation' | 'clouds' | 'wind'
  const [timelineStep, setTimelineStep] = useState(4); // 0 to 4 (representing -45m, -30m, -15m, -5m, Live)
  const [zoomLevel, setZoomLevel] = useState(1);

  const timeLabels = ['-45m', '-30m', '-15m', '-5m', 'LIVE'];

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimelineStep((prev) => (prev + 1) % 5);
    }, 1200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  if (!isOpen) return null;

  return (
    <div
      id="radar-modal-overlay"
      className="fixed inset-0 z-50 bg-surface-container-lowest/90 backdrop-blur-2xl flex flex-col pt-safe pb-safe animate-fadeIn"
    >
      {/* Radar Top Header */}
      <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-outline-variant/30 bg-surface/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-on-surface">
                Doppler Radar Loop
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container text-[10px] font-mono font-bold">
                {timeLabels[timelineStep]}
              </span>
            </div>
            <span className="text-xs font-mono text-on-surface-variant">
              {city?.name || 'Local Station'} • 45 mi scan radius
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface hover:text-primary flex items-center justify-center transition-colors active:scale-95"
          aria-label="Close radar map"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Radar Main Stage */}
      <div className="relative flex-1 w-full bg-surface-container-lowest overflow-hidden flex items-center justify-center">
        {/* Synthetic Map Background Grid */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#47d6ff 1px, transparent 1px), linear-gradient(to right, #171f33 1px, transparent 1px), linear-gradient(to bottom, #171f33 1px, transparent 1px)`,
            backgroundSize: '40px 40px, 80px 80px, 80px 80px'
          }}
        />

        {/* Circular Radar Sweep Screen */}
        <div
          className="relative w-[340px] h-[340px] sm:w-[480px] sm:h-[480px] rounded-full border-2 border-primary/30 shadow-[0_0_50px_rgba(0,210,255,0.15)] flex items-center justify-center transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* Range Distance Concentric Rings */}
          <div className="absolute inset-8 rounded-full border border-primary/20" />
          <div className="absolute inset-20 rounded-full border border-primary/25" />
          <div className="absolute inset-32 rounded-full border border-primary/30" />
          <div className="absolute inset-44 rounded-full border border-primary/35" />

          {/* Coordinate Crosshairs */}
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-primary/25" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-primary/25" />

          {/* Sweep Beam Cone */}
          <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
            <div className="w-full h-full animate-spin-slow origin-center">
              <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                <defs>
                  <linearGradient id="beamGradient" x1="50" y1="50" x2="100" y2="25" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#00D2FF" stopOpacity="0.75" />
                    <stop offset="100%" stopColor="#00D2FF" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d="M50 50 L100 25 A50 50 0 0 0 85 0 Z" fill="url(#beamGradient)" />
              </svg>
            </div>
          </div>

          {/* Dynamic Radar Echo Cells */}
          {activeLayer === 'precipitation' && (
            <>
              <div
                className="absolute w-20 h-16 rounded-full bg-emerald-500/40 blur-md transition-all duration-700"
                style={{
                  top: `${32 + (timelineStep * 3)}%`,
                  left: `${45 + (timelineStep * 4)}%`
                }}
              />
              <div
                className="absolute w-12 h-10 rounded-full bg-amber-500/50 blur-sm transition-all duration-700"
                style={{
                  top: `${34 + (timelineStep * 3)}%`,
                  left: `${47 + (timelineStep * 4)}%`
                }}
              />
              <div
                className="absolute w-6 h-5 rounded-full bg-rose-500/60 blur-[2px] transition-all duration-700"
                style={{
                  top: `${36 + (timelineStep * 3)}%`,
                  left: `${49 + (timelineStep * 4)}%`
                }}
              />
            </>
          )}

          {activeLayer === 'clouds' && (
            <div
              className="absolute w-52 h-40 rounded-full bg-cyan-400/20 blur-xl transition-all duration-1000"
              style={{
                top: `${20 + timelineStep * 2}%`,
                left: `${25 + timelineStep * 3}%`
              }}
            />
          )}

          {/* Center Station Pin */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/30 shadow-lg animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-primary mt-1 bg-surface-container-high/90 px-1.5 py-0.5 rounded shadow">
              {city?.name || 'Station'}
            </span>
          </div>
        </div>

        {/* Map View Floating Controls (Zoom & Orientation) */}
        <div className="absolute right-4 top-4 flex flex-col gap-2 z-20">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.2, 1.6))}
            className="w-9 h-9 rounded-lg bg-surface-container-high/90 border border-outline-variant/30 text-on-surface hover:text-primary flex items-center justify-center transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.2, 0.8))}
            className="w-9 h-9 rounded-lg bg-surface-container-high/90 border border-outline-variant/30 text-on-surface hover:text-primary flex items-center justify-center transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Reflectivity Legend (dBZ) */}
        <div className="absolute left-4 bottom-24 sm:bottom-20 z-20 p-2.5 rounded-xl bg-surface-container-high/90 backdrop-blur-md border border-outline-variant/30 shadow-md">
          <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-wider block mb-1">
            Reflectivity (dBZ)
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-mono text-outline">Light</span>
            <div className="h-2 w-28 rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500" />
            <span className="text-[10px] font-mono text-outline">Heavy</span>
          </div>
        </div>
      </div>

      {/* Radar Bottom Controls & Scrubber */}
      <div className="p-4 sm:p-5 border-t border-outline-variant/30 bg-surface/90 backdrop-blur-xl flex flex-col gap-3">
        {/* Layer Switches */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveLayer('precipitation')}
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                activeLayer === 'precipitation'
                  ? 'bg-primary-container text-on-primary-container shadow'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Precipitation
            </button>
            <button
              onClick={() => setActiveLayer('clouds')}
              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all ${
                activeLayer === 'clouds'
                  ? 'bg-primary-container text-on-primary-container shadow'
                  : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Cloud Cover
            </button>
          </div>

          <span className="text-xs font-mono text-primary font-bold">
            SCAN: 2.8 GHz S-BAND
          </span>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-9 h-9 rounded-xl bg-surface-container-high text-primary flex items-center justify-center hover:bg-surface-container-highest transition-colors shrink-0"
            title={isPlaying ? 'Pause radar loop' : 'Play radar loop'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          </button>

          <div className="flex-1 flex items-center gap-2">
            {timeLabels.map((label, idx) => (
              <button
                key={label}
                onClick={() => {
                  setIsPlaying(false);
                  setTimelineStep(idx);
                }}
                className={`flex-1 py-1 rounded-md text-[11px] font-mono transition-all text-center ${
                  timelineStep === idx
                    ? 'bg-primary text-slate-950 font-bold shadow'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
