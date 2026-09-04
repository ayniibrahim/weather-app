/**
 * Weatherly - Fixed Bottom Atmospheric Navigation Bar
 * Recreates the navigation bar with Dashboard, Radar/Map, Saved Cities, and Settings.
 */

import React from 'react';
import { LayoutDashboard, Radio, Building2, Sliders } from 'lucide-react';

export default function Navigation({ activeTab, onTabChange }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
    { id: 'radar-map', label: 'Radar / Map', Icon: Radio },
    { id: 'saved-cities', label: 'Saved Cities', Icon: Building2 },
    { id: 'settings', label: 'Settings', Icon: Sliders }
  ];

  return (
    <nav
      id="weatherly-bottom-nav"
      className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface-container-lowest/90 backdrop-blur-2xl border-t border-outline-variant/30 shadow-[0_-4px_24px_rgba(0,0,0,0.4)]"
    >
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map(({ id, label, Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              aria-label={label}
              className={`flex flex-col items-center justify-center gap-1 w-20 h-12 transition-all cursor-pointer ${
                isActive
                  ? 'text-primary font-semibold scale-105'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-on-surface-variant'}`} />
              <span className="text-[11px] font-mono tracking-tight">{label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
