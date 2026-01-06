# Endel Clone - Product Requirements Document

## Overview
A pixel-perfect frontend clone of https://app.endel.io - a personalized soundscapes app for focus, relaxation, and sleep.

## Tech Stack
- **Frontend**: React 19 with Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React + Custom SVG icons
- **Routing**: React Router DOM

## Features Implemented

### 1. Header
- Endel-style logo with circular icon
- "FREEMIUM" badge
- Sign In button (triggers modal)

### 2. Banner Carousel
- Auto-rotating carousel (5 second intervals)
- 3 promotional banners with colorful floral images
- Dot indicators for navigation
- Smooth slide transitions

### 3. Scenarios Section
- 17 scenario buttons (Focus Timer, Anxiety Relief, etc.)
- Lock icons indicating premium features
- Pill-shaped button design

### 4. Soundscape Sections
- **Focus**: Focus, Colored Noises, Dynamic Focus, Study, Deeper Focus
- **Relax**: Relax, 8D Odyssey, Nature Elements, Spatial Orbit, Hibernation, Recovery, Wiggly Wisdom
- **Sleep**: Sleep, Rainy Outside, Wind Down, AI Lullaby
- Custom SVG icons for each soundscape
- Lock/unlock states

### 5. Bottom Player
- Floating player bar
- Current track info with icon
- Play/Pause functionality
- Paused/Playing status

### 6. Modals
- **Sign In Modal**: Google, Apple, Email authentication options
- **Premium Modal**: Feature unlock, pricing, benefits list

## Design System
- **Background**: Pure black (#000000)
- **Text**: White with opacity variations
- **Font**: Inter (light, regular, medium weights)
- **Border Radius**: Rounded corners (rounded-full for pills, rounded-xl for modals)
- **Spacing**: Generous whitespace following modern design principles

## File Structure
```
/app/frontend/src/
├── components/
│   ├── Header.jsx
│   ├── Banner.jsx
│   ├── Scenarios.jsx
│   ├── SoundscapeSection.jsx
│   ├── Player.jsx
│   ├── SignInModal.jsx
│   ├── PremiumModal.jsx
│   └── icons/
│       └── SoundscapeIcons.jsx
├── pages/
│   └── HomePage.jsx
├── data/
│   └── mock.js
├── App.js
└── App.css
```

## Data (MOCKED)
All data including banners, scenarios, and soundscapes are mocked in `/app/frontend/src/data/mock.js`. No backend integration.

## Status
✅ Frontend Complete with mock data
❌ No backend implementation (frontend-only clone)
