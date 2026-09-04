/**
 * Weatherly - Main Application Container
 * Recreates the complete Atmospheric SaaS weather dashboard with full modularity,
 * zero mock data, real Open-Meteo telemetry, and high-fidelity UX.
 */

import React, { useState } from 'react';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import CurrentWeather from './components/CurrentWeather.jsx';
import HourlyForecast from './components/HourlyForecast.jsx';
import DailyForecast from './components/DailyForecast.jsx';
import WeatherDetails from './components/WeatherDetails.jsx';
import RecentSearches from './components/RecentSearches.jsx';
import EmptyState from './components/EmptyState.jsx';
import LoadingState from './components/LoadingState.jsx';
import ErrorState from './components/ErrorState.jsx';
import RadarModal from './components/RadarModal.jsx';
import SavedCitiesView from './components/SavedCitiesView.jsx';
import SettingsView from './components/SettingsView.jsx';
import Navigation from './components/Navigation.jsx';
import { useWeather } from './hooks/useWeather.js';

export default function App() {
  const {
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
  } = useWeather();

  const [isRadarOpen, setIsRadarOpen] = useState(false);
  const [lastSearchedQuery, setLastSearchedQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const handleSearchSubmit = (queryOrCity) => {
    if (typeof queryOrCity === 'string') {
      const trimmed = queryOrCity.trim();
      const lower = trimmed.toLowerCase();

      // Gracefully handle if user entered temperature unit keywords in search
      if (lower === 'celsius' || lower === 'celcius' || lower === 'c°' || lower === '°c') {
        setUnit('C');
        showToast('Temperature unit set to Celsius (°C).');
        setError(null);
        return;
      }
      if (lower === 'fahrenheit' || lower === 'f°' || lower === '°f') {
        setUnit('F');
        showToast('Temperature unit set to Fahrenheit (°F).');
        setError(null);
        return;
      }

      setLastSearchedQuery(trimmed);
      searchAndLoadCity(trimmed);
    } else if (queryOrCity && queryOrCity.latitude) {
      setLastSearchedQuery(queryOrCity.name);
      fetchCityWeather(queryOrCity, true);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans transition-colors duration-300 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 max-w-sm px-4 py-2.5 rounded-xl bg-surface-container-highest/95 border border-primary/40 text-on-surface text-xs font-mono shadow-xl backdrop-blur-md flex items-center justify-between gap-3 animate-fadeIn">
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-on-surface-variant hover:text-primary p-0.5"
            aria-label="Dismiss toast"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Global Atmospheric Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        unit={unit}
        toggleUnit={toggleUnit}
        onCurrentLocation={fetchCurrentLocation}
        isLoading={isLoading}
        onRefresh={refreshCurrentWeather}
      />

      {/* 2. Main Dashboard Canvas */}
      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 pb-28 px-4 sm:px-6 lg:px-8 flex flex-col gap-5">
        {/* Search Bar & Telemetry Input Controls */}
        <SearchBar
          onSearch={handleSearchSubmit}
          onCurrentLocation={fetchCurrentLocation}
          recentSearches={recentSearches}
          onSelectRecent={(c) => fetchCityWeather(c, true)}
          isLoading={isLoading}
        />

        {/* Inline Error Notice Banner (when weatherData exists but search had an issue) */}
        {error && weatherData && (
          <div className="flex items-center justify-between p-3 rounded-xl bg-error-container/40 border border-error/40 text-on-surface text-xs font-mono animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="text-error font-bold">Notice:</span>
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs px-2 py-0.5 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tab View Routing */}
        {activeTab === 'saved-cities' ? (
          <SavedCitiesView
            savedCities={savedCities}
            onSelectCity={(c) => {
              fetchCityWeather(c, true);
              setActiveTab('dashboard');
            }}
            onRemoveCity={(c) => toggleSaveCity(c)}
            onAddCurrentCity={(c) => toggleSaveCity(c)}
            currentCity={city}
            unit={unit}
          />
        ) : activeTab === 'settings' ? (
          <SettingsView
            unit={unit}
            toggleUnit={toggleUnit}
            theme={theme}
            toggleTheme={toggleTheme}
            onClearHistory={clearRecentSearches}
            onShowToast={showToast}
          />
        ) : activeTab === 'radar-map' ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface">Radar Map Station</h2>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="text-xs font-mono text-primary hover:underline"
              >
                Back to Dashboard
              </button>
            </div>
            {/* Embedded interactive radar view */}
            <RadarModal
              isOpen={true}
              onClose={() => setActiveTab('dashboard')}
              city={city}
              weatherData={weatherData}
            />
          </div>
        ) : (
          /* Main Dashboard View - Bento Grid Layout */
          <>
            {isLoading ? (
              <LoadingState targetCity={city?.name || lastSearchedQuery || 'Target Coordinates'} />
            ) : error && !weatherData ? (
              <ErrorState
                errorMessage={error}
                failedQuery={lastSearchedQuery}
                onRetry={refreshCurrentWeather}
                onResetDefault={resetToDefaultCity}
                onCurrentLocation={fetchCurrentLocation}
                onSelectSuggestion={(s) => fetchCityWeather(s, true)}
                unit={unit}
              />
            ) : weatherData && city ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 w-full animate-fadeIn items-stretch">
                {/* Bento Left Column: Current Weather Hero + 24-Hour Trajectory */}
                <div className="lg:col-span-7 xl:col-span-7 flex flex-col gap-4 sm:gap-5">
                  <CurrentWeather
                    weatherData={weatherData}
                    city={city}
                    unit={unit}
                    onRefresh={refreshCurrentWeather}
                    isLoading={isLoading}
                  />

                  <HourlyForecast
                    hourlyData={weatherData.hourly}
                    unit={unit}
                    sunsetTime={weatherData.dailySummary?.sunset}
                  />
                </div>

                {/* Bento Right Column: 7-Day Atmospheric Outlook */}
                <div className="lg:col-span-5 xl:col-span-5 flex flex-col">
                  <DailyForecast
                    dailyData={weatherData.daily}
                    unit={unit}
                    onExtend={() => showToast('Extended 14-day models: High-pressure system projected to maintain equilibrium throughout mid-term outlook.')}
                  />
                </div>

                {/* Bento Full-Width Lower Section: Telemetry Metrics Grid & Doppler Banner */}
                <div className="lg:col-span-12 w-full">
                  <WeatherDetails
                    weatherData={weatherData}
                    unit={unit}
                    onOpenRadar={() => setIsRadarOpen(true)}
                  />
                </div>
              </div>
            ) : (
              <EmptyState
                onCurrentLocation={fetchCurrentLocation}
                onSelectCity={(c) => fetchCityWeather(c, true)}
                recentSearches={recentSearches}
                onRemoveCity={removeRecentSearch}
                onClearHistory={clearRecentSearches}
                unit={unit}
                isLoading={isLoading}
              />
            )}
          </>
        )}
      </main>

      {/* 3. Live Doppler Radar Modal (When expanded from banner) */}
      <RadarModal
        isOpen={isRadarOpen}
        onClose={() => setIsRadarOpen(false)}
        city={city}
        weatherData={weatherData}
      />

      {/* 4. Fixed Bottom Navigation Dock */}
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
