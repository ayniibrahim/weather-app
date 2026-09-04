# Weatherly — Atmospheric SaaS Weather Dashboard

> A production-grade atmospheric telemetry and weather intelligence web application built with modern React.js, Tailwind CSS, and real-time Open-Meteo & Geolocation APIs.

[![React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-00d2ff.svg?style=flat)](https://open-meteo.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## 🌤️ Highlights & Features

1. **Zero Mock Weather Data**:
   - Integrated with Open-Meteo high-resolution Numerical Weather Prediction (NWP) API.
   - City search powered by Open-Meteo Geocoding API with debounced autocomplete and coordinate extraction.
   - No API key required for friction-free setup and deployment.

2. **Hero Telemetry & Current Conditions**:
   - Live location name, sub-division/country, and precise coordinate pins (`37.7749° N, 122.4194° W`).
   - Large display temperature with one-click `°F` / `°C` switching.
   - Feels-like temperature with microclimate descriptors.
   - Dynamic SVG atmospheric weather illustration matching WMO condition codes.
   - Daily High/Low range pill and real-time Air Quality Index (`AQI`) diagnostic badge.

3. **24-Hour Trajectory (Hourly Forecast)**:
   - Horizontally scrollable smooth carousel with snap alignment.
   - Highlights the current hour with active cyan ring and elevated shadow.
   - Displays hour timestamp, dynamic condition icon, temperature, and precipitation probability (`%`).

4. **7-Day Atmospheric Outlook**:
   - Comprehensive weekly breakdown with weekday names, condition icons, and weather labels.
   - Proportional gradient temperature range bars mapping low to high boundaries.

5. **Granular Telemetry Suite (6-Card Array)**:
   - **Humidity**: Relative humidity percentage, fill meter, and calculated dew point.
   - **Wind Flow**: Speed, cardinal azimuth (e.g. `NW`), 360° rotating vector needle, and estimated coastal gusts.
   - **UV Index**: Numeric scale, category badge (`Moderate`, `High`, `Extreme`), and spectral position indicator with sun protection advisories.
   - **Barometric Pressure**: Pressure in `hPa` with isobaric gradient trend labels (`Stable & Steady`, `High Ridge`).
   - **Visibility**: Distance in miles/kilometers with horizon clarity metrics.
   - **Sun Cycle**: Exact sunrise and sunset times with dynamic solar trajectory arc tracking current sun position.

6. **Live Doppler Radar Loop**:
   - Expandable radar station modal with simulated 2.8 GHz S-band radar sweep.
   - Time scrubber (`-45m`, `-30m`, `-15m`, `-5m`, `LIVE`) with interactive play/pause.
   - Reflectivity dBZ color index and layer switching (Precipitation vs. Cloud Cover).

7. **Recent Searches & Local Storage**:
   - Deduplicated history of up to 5 recent queries stored in `localStorage`.
   - Displays city, country, temperature, and condition icon with instant one-click reloading and individual removal.

8. **Browser Geolocation (GPS)**:
   - One-tap "Current Location" button utilizing the Browser Geolocation API.
   - Reverse geocodes device coordinates to locality names and retrieves local conditions immediately.

9. **Atmospheric Dark & Solar Light Themes**:
   - Complete dark and light theme toggle with smooth transitions.
   - Persistent preference stored in `localStorage` with automatic system preference detection.

10. **Resilient UX States**:
    - **Atmosphere Discovery Empty State**: Radar HUD vector, GPS action button, curated popular global hubs (`New York`, `Tokyo`, `Paris`, `Sydney`), and meteorology insight card.
    - **Skeleton Loading State**: Shimmering telemetry uplink banner, rotating telemetry status strings, and skeleton loaders mirroring the layout.
    - **Diagnostic Error State**: 404 Geocoding vector illustration, "Did you mean?" suggestions with live coordinates, and troubleshooting signal gateway with retry action.

---

## 📂 Project Structure

```
src/
├── components/
│   ├── Header.jsx           # Logo, PRO badge, unit toggle, GPS, theme switch, avatar
│   ├── SearchBar.jsx        # Geocoding input, debounced autocomplete, quick pills
│   ├── CurrentWeather.jsx   # Hero card, coordinates, dynamic SVG graphic, AQI
│   ├── HourlyForecast.jsx   # 24-Hour horizontal trajectory carousel with snap
│   ├── DailyForecast.jsx    # 7-day outlook with normalized gradient temperature bars
│   ├── WeatherDetails.jsx   # 6 telemetry cards (Humidity, Wind, UV, Pressure, Visibility, Sun Cycle) + Doppler loop banner
│   ├── RecentSearches.jsx   # LocalStorage search history cards with quick removal
│   ├── EmptyState.jsx       # Initial discovery view with popular hubs & NOAA insight
│   ├── LoadingState.jsx     # Telemetry uplink status & skeleton layout
│   ├── ErrorState.jsx       # 404 Geocoding diagnostic, suggestions & retry gateway
│   ├── RadarModal.jsx       # Interactive Live Doppler Radar station & scrubber
│   ├── SavedCitiesView.jsx  # Bookmarked locations manager
│   ├── SettingsView.jsx     # Preferences, units, theme, and API attribution
│   └── Navigation.jsx       # Bottom fixed atmospheric dock
│
├── services/
│   └── weatherApi.js        # Open-Meteo Weather, Geocoding & Reverse-geocoding API services
│
├── hooks/
│   └── useWeather.js        # Custom React hook for state, cache, units, and history
│
├── utils/
│   └── weatherUtils.js      # WMO weather code interpreters, math conversions & formatters
│
├── App.jsx                  # Main application orchestrator
├── main.jsx                 # React root entry point
├── main.tsx                 # TypeScript entry point
└── index.css                # Tailwind CSS v4 custom theme and atmospheric design tokens
```

---

## 📦 Dependencies

- **React 19** & **React-DOM 19**
- **Vite 6**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** (`lucide-react`)
- **Motion** (`motion`)

---

## 🚀 Getting Started Locally

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 1. Installation Commands
```bash
# Clone repository
git clone https://github.com/your-username/weatherly.git

# Navigate to project directory
cd weatherly

# Install dependencies
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The application will boot at `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
This bundles the optimized static assets into the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🌐 How to Deploy to Vercel

You can deploy Weatherly to Vercel in seconds with zero configuration:

### Option A: Via Vercel CLI
```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy directly from terminal
vercel
```

### Option B: Via Vercel Web Dashboard
1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [vercel.com/new](https://vercel.com/new).
3. Import your `weatherly` repository.
4. Select **Vite** as the Framework Preset (Vercel auto-detects this).
5. Build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click **Deploy**. Your app will be live with free global CDN and automatic HTTPS!

---

## ⚖️ License
Released under the [MIT License](LICENSE). Built for developers and weather enthusiasts worldwide.
