/**
 * Weatherly - Custom React Hook for Weather Telemetry State & Cache
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { searchCities, getWeatherData, reverseGeocode } from '../services/weatherApi.js';

const STORAGE_KEYS = {
  RECENT: 'weatherly_recent_searches_v2',
  SAVED: 'weatherly_saved_cities_v2',
  UNIT: 'weatherly_temp_unit_v3',
  THEME: 'weatherly_theme_mode_v2',
  LAST_CITY: 'weatherly_last_viewed_city_v2'
};

const DEFAULT_POPULAR_CITIES = [
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6895, longitude: 139.6917 },
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278 },
  { name: 'New York', country: 'United States', countryCode: 'US', admin1: 'New York', latitude: 40.7128, longitude: -74.0060 },
  { name: 'Paris', country: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522 },
  { name: 'Sydney', country: 'Australia', countryCode: 'AU', latitude: -33.8688, longitude: 151.2093 }
];

export function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedCities, setSavedCities] = useState([]);
  const [unit, setUnit] = useState('C'); // Default to Celsius ('C')
  const [theme, setTheme] = useState('dark');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastUpdatedTime, setLastUpdatedTime] = useState(null);

  // Read initial preferences from LocalStorage
  useEffect(() => {
    try {
      const storedUnit = localStorage.getItem(STORAGE_KEYS.UNIT);
      if (storedUnit === 'C' || storedUnit === 'F') {
        setUnit(storedUnit);
      } else {
        setUnit('C');
        localStorage.setItem(STORAGE_KEYS.UNIT, 'C');
      }

      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (storedTheme === 'light' || storedTheme === 'dark') {
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');
      } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = prefersDark ? 'dark' : 'dark'; // default to atmospheric dark SaaS
        setTheme(initialTheme);
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
      }

      const storedRecent = localStorage.getItem(STORAGE_KEYS.RECENT);
      if (storedRecent) {
        const parsed = JSON.parse(storedRecent);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 5));
        }
      }

      const storedSaved = localStorage.getItem(STORAGE_KEYS.SAVED);
      if (storedSaved) {
        const parsed = JSON.parse(storedSaved);
        if (Array.isArray(parsed)) {
          setSavedCities(parsed);
        }
      }

      // Check last viewed city or initialize with San Francisco for first-turn demonstration
      const storedLastCity = localStorage.getItem(STORAGE_KEYS.LAST_CITY);
      if (storedLastCity) {
        try {
          const parsedCity = JSON.parse(storedLastCity);
          if (parsedCity?.latitude && parsedCity?.longitude) {
            fetchCityWeather(parsedCity, false);
            return;
          }
        } catch (e) {
          console.warn('Error reading stored city:', e);
        }
      }

      // Default demo city: San Francisco, CA
      const defaultSF = {
        name: 'San Francisco',
        country: 'United States',
        countryCode: 'US',
        admin1: 'California',
        latitude: 37.7749,
        longitude: -122.4194
      };
      fetchCityWeather(defaultSF, false);
    } catch (e) {
      console.warn('LocalStorage error on init:', e);
    }
  }, []);

  // Update theme on html element and persist
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => {
      const nextTheme = prevTheme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEYS.THEME, nextTheme);
      } catch (err) {
        console.warn('Theme save error:', err);
      }
      document.documentElement.classList.toggle('dark', nextTheme === 'dark');
      return nextTheme;
    });
  }, []);

  // Toggle temperature unit (°C / °F)
  const toggleUnit = useCallback(() => {
    setUnit((prevUnit) => {
      const nextUnit = prevUnit === 'F' ? 'C' : 'F';
      try {
        localStorage.setItem(STORAGE_KEYS.UNIT, nextUnit);
      } catch (err) {
        console.warn('Unit save error:', err);
      }
      return nextUnit;
    });
  }, []);

  // Save to recent searches (limit to 5, deduplicate by name & country)
  const addToRecent = useCallback((cityObj, weatherSummary) => {
    if (!cityObj || !cityObj.name) return;

    setRecentSearches((prev) => {
      const filtered = prev.filter(
        (item) => !(item.name.toLowerCase() === cityObj.name.toLowerCase() &&
                   (item.countryCode || item.country) === (cityObj.countryCode || cityObj.country))
      );

      const newEntry = {
        name: cityObj.name,
        country: cityObj.country || '',
        countryCode: cityObj.countryCode || '',
        admin1: cityObj.admin1 || '',
        latitude: cityObj.latitude,
        longitude: cityObj.longitude,
        temperature: weatherSummary?.temperature ?? null,
        weatherCode: weatherSummary?.weatherCode ?? 0,
        timestamp: Date.now()
      };

      const updated = [newEntry, ...filtered].slice(0, 5);
      try {
        localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(updated));
      } catch (e) {
        console.warn('Recent save error:', e);
      }
      return updated;
    });
  }, []);

  // Fetch weather for a concrete city object
  const fetchCityWeather = useCallback(async (cityObj, saveToHistory = true) => {
    if (!cityObj || cityObj.latitude === undefined || cityObj.longitude === undefined) {
      setError('Coordinates missing for selected location.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(cityObj.latitude, cityObj.longitude, cityObj.timezone);
      setWeatherData(data);
      setCity(cityObj);
      setLastUpdatedTime(new Date());

      try {
        localStorage.setItem(STORAGE_KEYS.LAST_CITY, JSON.stringify(cityObj));
      } catch (e) {
        // ignore
      }

      if (saveToHistory) {
        addToRecent(cityObj, {
          temperature: data.current.temperature,
          weatherCode: data.current.weatherCode
        });
      }
    } catch (err) {
      console.error('Fetch weather error:', err);
      setError(err.message || 'Failed to retrieve meteorological telemetry.');
    } finally {
      setIsLoading(false);
    }
  }, [addToRecent]);

  // Search by city name query and load top match
  const searchAndLoadCity = useCallback(async (query) => {
    if (!query || !query.trim()) {
      setError('Please enter a city name to search.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await searchCities(query.trim());
      if (!results || results.length === 0) {
        setError(`City "${query.trim()}" not found. Please check the spelling and try again.`);
        setIsLoading(false);
        return;
      }

      const topResult = results[0];
      await fetchCityWeather(topResult, true);
    } catch (err) {
      console.error('Search and load error:', err);
      setError(err.message || `Unable to locate "${query}". Please check your connection.`);
      setIsLoading(false);
    }
  }, [fetchCityWeather]);

  // Fetch using Browser Geolocation API
  const fetchCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode to get city name
          const geoCity = await reverseGeocode(latitude, longitude);
          await fetchCityWeather(geoCity, true);
        } catch (err) {
          console.warn('Reverse geocode failed:', err);
          const fallbackCity = {
            name: 'Local Position',
            country: '',
            latitude,
            longitude
          };
          await fetchCityWeather(fallbackCity, true);
        }
      },
      (geoError) => {
        setIsLoading(false);
        switch (geoError.code) {
          case geoError.PERMISSION_DENIED:
            setError('Location permission denied. Please allow location access or search manually.');
            break;
          case geoError.POSITION_UNAVAILABLE:
            setError('Location information is currently unavailable. Please check GPS signal.');
            break;
          case geoError.TIMEOUT:
            setError('Location request timed out. Please try searching for your city.');
            break;
          default:
            setError('An error occurred while detecting your location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  }, [fetchCityWeather]);

  // Force refresh current weather telemetry
  const refreshCurrentWeather = useCallback(() => {
    if (city) {
      fetchCityWeather(city, false);
    } else {
      const defaultSF = {
        name: 'San Francisco',
        country: 'United States',
        countryCode: 'US',
        admin1: 'California',
        latitude: 37.7749,
        longitude: -122.4194
      };
      fetchCityWeather(defaultSF, false);
    }
  }, [city, fetchCityWeather]);

  // Reset to default hub city and clear any error
  const resetToDefaultCity = useCallback(() => {
    setError(null);
    const defaultSF = {
      name: 'San Francisco',
      country: 'United States',
      countryCode: 'US',
      admin1: 'California',
      latitude: 37.7749,
      longitude: -122.4194
    };
    fetchCityWeather(defaultSF, false);
  }, [fetchCityWeather]);

  // Clear search history
  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEYS.RECENT);
    } catch (e) {
      // ignore
    }
  }, []);

  // Remove specific recent item
  const removeRecentSearch = useCallback((cityName) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((c) => c.name.toLowerCase() !== cityName.toLowerCase());
      try {
        localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  }, []);

  // Toggle bookmark / saved city
  const toggleSaveCity = useCallback((cityObj) => {
    if (!cityObj || !cityObj.name) return;
    setSavedCities((prev) => {
      const exists = prev.some((c) => c.name.toLowerCase() === cityObj.name.toLowerCase());
      let updated;
      if (exists) {
        updated = prev.filter((c) => c.name.toLowerCase() !== cityObj.name.toLowerCase());
      } else {
        updated = [...prev, cityObj];
      }
      try {
        localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(updated));
      } catch (e) {
        // ignore
      }
      return updated;
    });
  }, []);

  return {
    weatherData,
    city,
    isLoading,
    error,
    recentSearches,
    savedCities,
    unit,
    setUnit,
    theme,
    activeTab,
    lastUpdatedTime,
    defaultHubs: DEFAULT_POPULAR_CITIES,
    fetchCityWeather,
    searchAndLoadCity,
    fetchCurrentLocation,
    refreshCurrentWeather,
    resetToDefaultCity,
    toggleUnit,
    toggleTheme,
    clearRecentSearches,
    removeRecentSearch,
    toggleSaveCity,
    setActiveTab,
    setError
  };
}
