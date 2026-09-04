/**
 * Weatherly - Weather Utility Functions & WMO Interpreters
 */

import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
  Sparkles,
  Wind
} from 'lucide-react';

/**
 * Converts Open-Meteo WMO weather codes into readable conditions, descriptions, and Lucide icons.
 * WMO Code Standard:
 * 0 = Clear sky
 * 1-3 = Mainly clear, partly cloudy, and overcast
 * 45, 48 = Fog and depositing rime fog
 * 51, 53, 55 = Drizzle: Light, moderate, and dense intensity
 * 56, 57 = Freezing Drizzle: Light and dense intensity
 * 61, 63, 65 = Rain: Slight, moderate and heavy intensity
 * 66, 67 = Freezing Rain: Light and heavy intensity
 * 71, 73, 75 = Snow fall: Slight, moderate, and heavy intensity
 * 77 = Snow grains
 * 80, 81, 82 = Rain showers: Slight, moderate, and violent
 * 85, 86 = Snow showers slight and heavy
 * 95 = Thunderstorm: Slight or moderate
 * 96, 99 = Thunderstorm with slight and heavy hail
 */
export function getWeatherCondition(code, isDay = 1) {
  const numericCode = Number(code);

  switch (numericCode) {
    case 0:
      return {
        label: isDay ? 'Sunny Clear' : 'Clear Night',
        description: isDay ? 'Optimal celestial clarity' : 'Starlight visibility',
        iconName: isDay ? 'Sun' : 'Moon',
        Icon: isDay ? Sun : Moon,
        color: isDay ? 'text-amber-400' : 'text-cyan-300',
        bgGlow: 'from-amber-500/20 to-orange-500/10',
        badge: 'Fair'
      };

    case 1:
      return {
        label: isDay ? 'Mostly Clear' : 'Clear Intervals',
        description: 'Light atmospheric scattering',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        Icon: isDay ? CloudSun : CloudMoon,
        color: isDay ? 'text-amber-300' : 'text-indigo-300',
        bgGlow: 'from-sky-500/20 to-amber-500/10',
        badge: 'Clear'
      };

    case 2:
      return {
        label: 'Partly Cloudy',
        description: 'Mild Sea Breeze & Fair Cumulus',
        iconName: isDay ? 'CloudSun' : 'CloudMoon',
        Icon: isDay ? CloudSun : CloudMoon,
        color: 'text-amber-300',
        bgGlow: 'from-cyan-500/20 to-amber-500/10',
        badge: 'Scattered'
      };

    case 3:
      return {
        label: 'Overcast',
        description: 'Dense stratocumulus ceiling',
        iconName: 'Cloud',
        Icon: Cloud,
        color: 'text-slate-300',
        bgGlow: 'from-slate-500/20 to-cyan-500/10',
        badge: 'Overcast'
      };

    case 45:
    case 48:
      return {
        label: numericCode === 48 ? 'Rime Fog' : 'Atmospheric Fog',
        description: 'Reduced horizontal visibility',
        iconName: 'CloudFog',
        Icon: CloudFog,
        color: 'text-slate-300',
        bgGlow: 'from-slate-600/20 to-cyan-700/10',
        badge: 'Fog'
      };

    case 51:
    case 53:
    case 55:
      return {
        label: numericCode === 51 ? 'Light Drizzle' : numericCode === 55 ? 'Dense Drizzle' : 'Drizzle',
        description: 'Gentle droplet precipitation',
        iconName: 'CloudDrizzle',
        Icon: CloudDrizzle,
        color: 'text-cyan-300',
        bgGlow: 'from-cyan-600/20 to-blue-600/10',
        badge: 'Drizzle'
      };

    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        description: 'Sub-zero liquid mist',
        iconName: 'CloudSnow',
        Icon: CloudSnow,
        color: 'text-cyan-200',
        bgGlow: 'from-cyan-400/20 to-blue-700/10',
        badge: 'Freeze'
      };

    case 61:
      return {
        label: 'Light Rain',
        description: 'Passing precipitation front',
        iconName: 'CloudRain',
        Icon: CloudRain,
        color: 'text-cyan-400',
        bgGlow: 'from-cyan-500/20 to-blue-600/10',
        badge: 'Rain'
      };

    case 63:
      return {
        label: 'Moderate Rain',
        description: 'Steady convective rainfall',
        iconName: 'CloudRain',
        Icon: CloudRain,
        color: 'text-cyan-400',
        bgGlow: 'from-blue-600/20 to-cyan-600/10',
        badge: 'Rain'
      };

    case 65:
      return {
        label: 'Heavy Rain',
        description: 'Intense atmospheric deluge',
        iconName: 'CloudRainWind',
        Icon: CloudRainWind,
        color: 'text-blue-400',
        bgGlow: 'from-blue-700/30 to-indigo-700/20',
        badge: 'Heavy Rain'
      };

    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        description: 'Ice accretion hazard',
        iconName: 'CloudSnow',
        Icon: CloudSnow,
        color: 'text-cyan-200',
        bgGlow: 'from-cyan-600/20 to-indigo-800/20',
        badge: 'Ice'
      };

    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: numericCode === 75 ? 'Heavy Snow' : numericCode === 71 ? 'Light Snow' : 'Snowfall',
        description: 'Accumulating crystalline flakes',
        iconName: 'CloudSnow',
        Icon: CloudSnow,
        color: 'text-indigo-200',
        bgGlow: 'from-blue-400/20 to-indigo-400/10',
        badge: 'Snow'
      };

    case 80:
    case 81:
    case 82:
      return {
        label: numericCode === 82 ? 'Violent Showers' : 'Rain Showers',
        description: 'Intermittent heavy precipitation',
        iconName: 'CloudRainWind',
        Icon: CloudRainWind,
        color: 'text-cyan-300',
        bgGlow: 'from-blue-500/20 to-cyan-400/10',
        badge: 'Showers'
      };

    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        description: 'Squall line flurries',
        iconName: 'CloudSnow',
        Icon: CloudSnow,
        color: 'text-indigo-200',
        bgGlow: 'from-indigo-500/20 to-blue-500/10',
        badge: 'Flurries'
      };

    case 95:
      return {
        label: 'Thunderstorm',
        description: 'Convective lightning discharges',
        iconName: 'CloudLightning',
        Icon: CloudLightning,
        color: 'text-amber-300',
        bgGlow: 'from-amber-600/25 to-purple-800/20',
        badge: 'Storm'
      };

    case 96:
    case 99:
      return {
        label: 'Thunderstorm with Hail',
        description: 'Severe convective storm cell',
        iconName: 'CloudLightning',
        Icon: CloudLightning,
        color: 'text-rose-400',
        bgGlow: 'from-rose-600/30 to-amber-600/20',
        badge: 'Severe'
      };

    default:
      return {
        label: 'Fair Sky',
        description: 'Stable atmospheric conditions',
        iconName: isDay ? 'Sun' : 'Moon',
        Icon: isDay ? Sun : Moon,
        color: isDay ? 'text-amber-400' : 'text-cyan-300',
        bgGlow: 'from-sky-500/20 to-cyan-500/10',
        badge: 'Normal'
      };
  }
}

/**
 * Converts wind degrees into 16-point cardinal direction
 */
export function getWindDirection(degrees) {
  if (degrees === undefined || degrees === null) return 'N';
  const val = Math.floor((degrees / 22.5) + 0.5);
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[(val % 16)];
}

/**
 * Temperature conversion
 */
export function convertTemperature(celsius, unit = 'C') {
  if (celsius === undefined || celsius === null) return '--';
  const num = Number(celsius);
  if (unit === 'F') {
    return Math.round((num * 9) / 5 + 32);
  }
  return Math.round(num);
}

/**
 * Wind speed conversion
 */
export function convertWindSpeed(kmh, unit = 'C') {
  if (kmh === undefined || kmh === null) return '--';
  const num = Number(kmh);
  if (unit === 'F') {
    // Return in MPH if temperature is in Fahrenheit (Imperial)
    return Math.round(num * 0.621371);
  }
  return Math.round(num);
}

/**
 * Visibility conversion
 */
export function convertVisibility(meters, unit = 'C') {
  if (!meters && meters !== 0) return { value: 10, unit: unit === 'F' ? 'MI' : 'KM' };
  if (unit === 'F') {
    const miles = Math.round((meters / 1609.34) * 10) / 10;
    return { value: miles > 10 ? 10 : miles, unit: 'MI' };
  }
  const km = Math.round((meters / 1000) * 10) / 10;
  return { value: km > 16 ? 16 : km, unit: 'KM' };
}

/**
 * UV Index category & advisory
 */
export function getUVCategory(uv) {
  const value = Math.round(Number(uv || 0));
  if (value <= 2) {
    return { label: 'Low', color: 'text-cyan-300', fill: '#00d2ff', advisory: 'Minimal sun hazard. Normal daylight activities.' };
  }
  if (value <= 5) {
    return { label: 'Moderate', color: 'text-amber-400', fill: '#feb300', advisory: 'Sun protection advised during peak afternoon.' };
  }
  if (value <= 7) {
    return { label: 'High', color: 'text-orange-400', fill: '#f97316', advisory: 'Seek shade during midday; wear hat and SPF 30+.' };
  }
  if (value <= 10) {
    return { label: 'Very High', color: 'text-rose-400', fill: '#e11d48', advisory: 'Take extra precautions; unprotected skin burns quickly.' };
  }
  return { label: 'Extreme', color: 'text-purple-400', fill: '#a855f7', advisory: 'Avoid direct solar exposure during peak hours.' };
}

/**
 * Pressure trend label
 */
export function getPressureTrend(pressure) {
  const p = Number(pressure || 1013);
  if (p > 1020) return { label: 'High Pressure Ridge', note: 'Sustaining clear, dry air masses' };
  if (p < 1005) return { label: 'Depression / Low Front', note: 'Unsettled atmospheric gradient' };
  return { label: 'Stable & Steady', note: 'Equilibrium isobaric conditions' };
}

/**
 * Formats ISO date string to readable weekday / time
 */
export function formatTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
}

export function formatHourOnly(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
}

export function formatDayName(isoString, index = 0) {
  if (index === 0) return 'Today';
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatDateHeader(isoDate = new Date()) {
  const date = new Date(isoDate);
  const weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  const month = date.toLocaleDateString('en-US', { month: 'short' });
  const day = date.getDate();
  return `${weekday}, ${month} ${day}`;
}
