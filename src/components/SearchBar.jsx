/**
 * Weatherly - Search Bar Component
 * Real-time geocoding search with debounce, autocomplete dropdown, quick presets, and GPS trigger.
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, ArrowRight, Crosshair, X, MapPin, Sparkles } from 'lucide-react';
import { searchCities } from '../services/weatherApi.js';

export default function SearchBar({
  onSearch,
  onCurrentLocation,
  recentSearches = [],
  onSelectRecent,
  isLoading
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search for autocomplete suggestions
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearchingSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingSuggestions(true);
        const results = await searchCities(query.trim());
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        console.warn('Autocomplete fetch failed:', err);
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setShowDropdown(false);
    onSearch(query.trim());
  };

  const handleSelectSuggestion = (city) => {
    setQuery(`${city.name}${city.admin1 ? `, ${city.admin1}` : ''}`);
    setShowDropdown(false);
    onSearch(city);
  };

  const clearInput = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <section id="search-section" className="flex flex-col gap-2.5 w-full">
      {/* Search Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2.5 w-full">
        <div className="relative flex-1 flex items-center bg-surface-container rounded-2xl border border-outline-variant/40 shadow-xs focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/40 transition-all">
          <Search className="absolute left-3.5 text-on-surface-variant w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />

          <input
            ref={inputRef}
            id="city-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            placeholder="Search city (e.g. San Francisco, Tokyo, London)..."
            aria-label="Search city"
            className="w-full pl-10 sm:pl-11 pr-20 py-3.5 bg-transparent text-on-surface font-sans text-sm placeholder:text-on-surface-variant/60 focus:outline-none"
          />

          <div className="absolute right-2 flex items-center gap-1">
            {query.length > 0 && (
              <button
                type="button"
                onClick={clearInput}
                className="w-7 h-7 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest flex items-center justify-center transition-colors"
                aria-label="Clear search input"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              id="submit-search-btn"
              type="submit"
              disabled={isLoading || !query.trim()}
              aria-label="Submit search"
              className="w-8 h-8 rounded-xl bg-primary-container text-on-primary-container hover:brightness-110 flex items-center justify-center shadow-xs active:scale-95 transition-all disabled:opacity-40"
            >
              <ArrowRight className="w-4 h-4 font-bold" />
            </button>
          </div>
        </div>

        {/* GPS Location Button */}
        <button
          type="button"
          id="quick-locate-btn"
          onClick={onCurrentLocation}
          disabled={isLoading}
          title="Use Current Location"
          aria-label="Locate GPS Position"
          className="w-12 h-12 rounded-2xl bg-surface-container border border-outline-variant/40 text-primary hover:text-white hover:bg-primary-container flex items-center justify-center shadow-xs hover:border-primary/40 active:scale-95 transition-all disabled:opacity-50 shrink-0"
        >
          <Crosshair className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        {/* Autocomplete Dropdown */}
        {showDropdown && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 right-14 mt-2 z-40 bg-surface-container border border-outline-variant/40 rounded-2xl shadow-xl overflow-hidden divide-y divide-outline-variant/20"
          >
            {suggestions.map((city) => (
              <button
                key={`${city.id}-${city.latitude}-${city.longitude}`}
                type="button"
                onClick={() => handleSelectSuggestion(city)}
                className="w-full text-left px-3.5 py-2.5 hover:bg-primary/10 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MapPin className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                  <div className="flex flex-col truncate">
                    <span className="font-semibold text-sm text-on-surface">
                      {city.name}
                      {city.admin1 && <span className="text-on-surface-variant font-normal">, {city.admin1}</span>}
                    </span>
                    <span className="text-xs text-on-surface-variant/80 font-mono">
                      {city.country || 'Global'}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-outline-variant group-hover:text-primary">
                  {city.latitude.toFixed(2)}°, {city.longitude.toFixed(2)}°
                </span>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Quick Search Preset Pill Rail */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar select-none">
        <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-secondary" />
          Recent:
        </span>

        {recentSearches.length > 0 ? (
          recentSearches.map((item, idx) => (
            <button
              key={`${item.name}-${idx}`}
              onClick={() => onSelectRecent(item)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:bg-surface-container text-xs whitespace-nowrap shadow-sm transition-all active:scale-95"
            >
              <span className="font-semibold text-on-surface">
                {item.name}{item.countryCode ? `, ${item.countryCode}` : ''}
              </span>
              {item.temperature !== null && item.temperature !== undefined && (
                <span className="font-mono text-secondary font-bold">
                  {Math.round(item.temperature)}°
                </span>
              )}
            </button>
          ))
        ) : (
          // Default recommended hubs if no recent searches yet
          <>
            <button
              onClick={() => onSearch('Tokyo, Japan')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:bg-surface-container text-xs whitespace-nowrap shadow-sm transition-all active:scale-95"
            >
              <span className="font-semibold text-on-surface">Tokyo, JP</span>
              <span className="font-mono text-secondary">18°</span>
            </button>
            <button
              onClick={() => onSearch('London, United Kingdom')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:bg-surface-container text-xs whitespace-nowrap shadow-sm transition-all active:scale-95"
            >
              <span className="font-semibold text-on-surface">London, UK</span>
              <span className="font-mono text-primary">14°</span>
            </button>
            <button
              onClick={() => onSearch('New York, United States')}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/20 text-on-surface-variant hover:text-primary hover:bg-surface-container text-xs whitespace-nowrap shadow-sm transition-all active:scale-95"
            >
              <span className="font-semibold text-on-surface">New York, US</span>
              <span className="font-mono text-secondary">22°</span>
            </button>
          </>
        )}
      </div>
    </section>
  );
}
