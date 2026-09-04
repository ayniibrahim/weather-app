/**
 * Weatherly - Open-Meteo & Geolocation API Services
 * No API key required. Direct Open-Meteo telemetry integration.
 */

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Searches cities using Open-Meteo Geocoding API
 * @param {string} query
 * @returns {Promise<Array>} List of matching city candidates
 */
export async function searchCities(query) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const cleanQuery = query.trim();
  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(cleanQuery)}&count=8&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Geocoding server responded with status: ${response.status}`);
    }

    const data = await response.json();
    if (data.results && Array.isArray(data.results) && data.results.length > 0) {
      return data.results.map((item) => ({
        id: item.id,
        name: item.name,
        country: item.country || '',
        countryCode: item.country_code || '',
        admin1: item.admin1 || '',
        latitude: item.latitude,
        longitude: item.longitude,
        elevation: item.elevation,
        timezone: item.timezone || 'auto'
      }));
    }

    // Fallback: If no results found and query has a comma (e.g. "London, UK", "New York, NY", "Paris, France")
    // retry with just the primary city name
    if (cleanQuery.includes(',')) {
      const primaryCity = cleanQuery.split(',')[0].trim();
      if (primaryCity && primaryCity.toLowerCase() !== cleanQuery.toLowerCase()) {
        const fallbackUrl = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(primaryCity)}&count=8&language=en&format=json`;
        const fbResponse = await fetch(fallbackUrl);
        if (fbResponse.ok) {
          const fbData = await fbResponse.json();
          if (fbData.results && Array.isArray(fbData.results) && fbData.results.length > 0) {
            return fbData.results.map((item) => ({
              id: item.id,
              name: item.name,
              country: item.country || '',
              countryCode: item.country_code || '',
              admin1: item.admin1 || '',
              latitude: item.latitude,
              longitude: item.longitude,
              elevation: item.elevation,
              timezone: item.timezone || 'auto'
            }));
          }
        }
      }
    }

    return [];
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
}

/**
 * Fetches comprehensive meteorological telemetry from Open-Meteo Forecast API
 * @param {number} latitude
 * @param {number} longitude
 * @param {string} timezone
 * @returns {Promise<Object>} Formatted weather state
 */
export async function getWeatherData(latitude, longitude, timezone = 'auto') {
  if (latitude === undefined || longitude === undefined) {
    throw new Error('Latitude and longitude are required to fetch weather data.');
  }

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'weather_code',
      'surface_pressure',
      'visibility',
      'wind_speed_10m',
      'wind_direction_10m',
      'uv_index'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max'
    ].join(','),
    timezone: timezone || 'auto'
  });

  const url = `${WEATHER_BASE_URL}?${params.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather telemetry server returned error: ${response.status}`);
    }

    const data = await response.json();

    // Extract current time index to anchor hourly trajectory cleanly
    const nowIso = data.current?.time;
    const hourlyTimes = data.hourly?.time || [];
    let currentIndex = 0;

    if (nowIso && hourlyTimes.length > 0) {
      const targetTime = new Date(nowIso).getTime();
      let smallestDiff = Infinity;
      hourlyTimes.forEach((t, idx) => {
        const diff = Math.abs(new Date(t).getTime() - targetTime);
        if (diff < smallestDiff) {
          smallestDiff = diff;
          currentIndex = idx;
        }
      });
    }

    // Slice next 24 consecutive hours
    const next24Hours = [];
    const maxHour = Math.min(currentIndex + 24, hourlyTimes.length);
    for (let i = currentIndex; i < maxHour; i++) {
      next24Hours.push({
        time: hourlyTimes[i],
        isCurrent: i === currentIndex,
        temperature: data.hourly?.temperature_2m?.[i],
        weatherCode: data.hourly?.weather_code?.[i] ?? 0,
        rainProbability: data.hourly?.precipitation_probability?.[i] ?? 0,
        humidity: data.hourly?.relative_humidity_2m?.[i],
        windSpeed: data.hourly?.wind_speed_10m?.[i],
        uvIndex: data.hourly?.uv_index?.[i]
      });
    }

    // Process daily forecast for next 7 days
    const dailyDays = [];
    const dailyCount = Math.min(7, (data.daily?.time || []).length);
    for (let i = 0; i < dailyCount; i++) {
      dailyDays.push({
        date: data.daily.time[i],
        dayIndex: i,
        weatherCode: data.daily.weather_code[i],
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        sunrise: data.daily.sunrise?.[i],
        sunset: data.daily.sunset?.[i],
        uvIndexMax: data.daily.uv_index_max?.[i],
        precipitationSum: data.daily.precipitation_sum?.[i] || 0,
        precipitationProbability: data.daily.precipitation_probability_max?.[i] || 0
      });
    }

    // Approximate Dew Point & Visibility from current hour
    const currentDewPoint = data.hourly?.dew_point_2m?.[currentIndex] ??
      Math.round(data.current.temperature_2m - ((100 - data.current.relative_humidity_2m) / 5));
    const currentVisibility = data.hourly?.visibility?.[currentIndex] ?? 10000;

    return {
      current: {
        time: data.current.time,
        temperature: data.current.temperature_2m,
        apparentTemperature: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        weatherCode: data.current.weather_code,
        pressure: Math.round(data.current.surface_pressure || 1013),
        windSpeed: Math.round(data.current.wind_speed_10m || 0),
        windDirection: data.current.wind_direction_10m || 0,
        isDay: data.current.is_day ?? 1,
        uvIndex: data.current.uv_index ?? (data.daily?.uv_index_max?.[0] || 3),
        precipitation: data.current.precipitation || 0,
        dewPoint: currentDewPoint,
        visibility: currentVisibility
      },
      dailySummary: {
        todayMax: data.daily?.temperature_2m_max?.[0] ?? Math.round(data.current.temperature_2m + 3),
        todayMin: data.daily?.temperature_2m_min?.[0] ?? Math.round(data.current.temperature_2m - 4),
        sunrise: data.daily?.sunrise?.[0],
        sunset: data.daily?.sunset?.[0]
      },
      hourly: next24Hours,
      daily: dailyDays,
      elevation: data.elevation,
      timezone: data.timezone
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}

/**
 * Reverse geocodes coordinates to a human-readable city and country
 * @param {number} latitude
 * @param {number} longitude
 * @returns {Promise<Object>}
 */
export async function reverseGeocode(latitude, longitude) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      const cityName = data.city || data.locality || data.principalSubdivision || 'Current Location';
      const country = data.countryName || '';
      const countryCode = data.countryCode || '';
      const admin1 = data.principalSubdivision || '';

      return {
        name: cityName,
        country: country,
        countryCode: countryCode,
        admin1: admin1,
        latitude,
        longitude
      };
    }
  } catch (err) {
    console.warn('Reverse geocoding service 1 failed, trying fallback...', err);
  }

  // Fallback default
  return {
    name: 'Current Location',
    country: '',
    countryCode: '',
    admin1: '',
    latitude,
    longitude
  };
}
