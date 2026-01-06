# Marjam - Loop Ideas Jamming App

## Overview
A music loop inspiration app for musicians and producers. Users can browse, preview, and download loop sequences in various lengths (8/16/32 bars) with mood-based filtering.

## Tech Stack
- **Frontend**: React 19 with Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React + Custom SVG icons
- **Routing**: React Router DOM

## Features Implemented

### 1. Header
- Marjam logo with purple gradient icon
- Brand name "Marjam"
- "FREE" badge
- Sign In button (triggers modal)

### 2. Banner Carousel
- Auto-rotating carousel (5 second intervals)
- 3 promotional banners with music studio images
- Dot indicators for navigation
- Smooth slide transitions

### 3. Mood Parameters Section
- 17 mood parameters for filtering loops:
  - **Free**: Peaceful, Focus, Groovy
  - **Premium**: Introspective, Uplift, Darker, Lighter, Banging, Dry, Wet, Minimal, Complex, Hypnotic, Energetic, Chill, Aggressive, Dreamy
- Toggle active moods (purple highlight when active)
- Lock icons for premium moods

### 4. Loop Sections
- **Drums**: Kick Foundation, Snare Groove, Hi-Hat Shuffle, Percussion Layer, Full Kit
- **Bass**: Sub Bass, Funk Bass, 808 Pattern, Acid Line, Deep Groove
- **Synths**: Pad Atmosphere, Lead Melody, Arp Sequence, Chord Progression, Texture Layer
- **FX & Transitions**: Risers, Impacts, Sweeps, Transitions
- Each loop shows: Name, BPM, custom icon
- Hover reveals download + play buttons

### 5. Bottom Player
- Floating player bar at bottom
- Loop icon + name + BPM
- Bar length indicator (8 bars badge)
- Stop & Play/Pause controls

### 6. Download Modal (Premium Feature)
- Loop info display
- Bar length selection: **8 bars**, **16 bars**, **32 bars**
- Duration estimates (~4 sec, ~8 sec, ~16 sec)
- File format info (WAV 44.1kHz)
- Download button with loading state

### 7. Premium Modal
- Feature-specific unlock title
- Benefits list:
  - Download loops in 8, 16, or 32 bar lengths
  - Unlimited access to all loop categories
  - All mood parameters unlocked
  - Stems & individual tracks export
  - Commercial license included
  - New loops added weekly
- Pricing: $9.99/month or $69.99/year (40% off)
- "Start Free Trial" CTA

### 8. Sign In Modal
- Google and Apple sign-in options
- Email sign-in with gradient button
- Terms agreement notice

## File Structure
```
/app/frontend/src/
├── components/
│   ├── Header.jsx
│   ├── Banner.jsx
│   ├── Scenarios.jsx (MoodParameters)
│   ├── SoundscapeSection.jsx (LoopSection)
│   ├── Player.jsx
│   ├── SignInModal.jsx
│   ├── PremiumModal.jsx
│   ├── DownloadModal.jsx
│   └── icons/
│       └── SoundscapeIcons.jsx (LoopIcons)
├── pages/
│   └── HomePage.jsx
├── data/
│   └── mock.js
├── App.js
└── App.css
```

## Data (MOCKED)
All data including banners, mood parameters, and loops are mocked in `/app/frontend/src/data/mock.js`. No backend integration - no actual audio files.

## Design System
- **Background**: Pure black (#000000)
- **Primary Accent**: Purple gradient (purple-500 to pink-500)
- **Active States**: Purple tint (purple-500/20)
- **Text**: White with opacity variations
- **Font**: Inter (light, regular, medium, semibold weights)

## Status
✅ Frontend Complete with mock data
❌ No backend implementation (frontend-only)
❌ No actual audio playback (visual only)
