// Mock data for Endel clone

export const banners = [
  {
    id: 1,
    badge: "SPECIAL OFFER",
    title: "Get 30% off Premium",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
    gradient: "from-pink-500 via-red-400 to-yellow-400",
    bgColor: "bg-gradient-to-r from-pink-600/20 to-blue-600/20"
  },
  {
    id: 2,
    badge: "MAJOR UPDATE",
    title: "Endel for ADHD",
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800&q=80",
    gradient: "from-purple-500 via-pink-400 to-orange-400",
    bgColor: "bg-gradient-to-r from-purple-600/20 to-orange-600/20"
  },
  {
    id: 3,
    badge: "NEW",
    title: "Endel Merch Available Now",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80",
    gradient: "from-green-500 via-teal-400 to-blue-400",
    bgColor: "bg-gradient-to-r from-green-600/20 to-blue-600/20"
  }
];

export const scenarios = [
  { id: 1, name: "Focus Timer", locked: true },
  { id: 2, name: "Anxiety Relief", locked: true },
  { id: 3, name: "Arousal", locked: true },
  { id: 4, name: "Attention Boost", locked: true },
  { id: 5, name: "ASMR", locked: true },
  { id: 6, name: "Baby Sleep", locked: true },
  { id: 7, name: "Binaural Beats", locked: true },
  { id: 8, name: "Brain Massage", locked: true },
  { id: 9, name: "Chores", locked: true },
  { id: 10, name: "Create", locked: true },
  { id: 11, name: "Deep Work", locked: true },
  { id: 12, name: "Self Care", locked: true },
  { id: 13, name: "Read", locked: true },
  { id: 14, name: "Power Nap", locked: true },
  { id: 15, name: "Meditate", locked: true },
  { id: 16, name: "Wake Up", locked: true },
  { id: 17, name: "Tinnitus Relief", locked: true }
];

export const focusSoundscapes = [
  { id: 1, name: "Focus", icon: "globe", locked: false },
  { id: 2, name: "Colored Noises", icon: "dots", locked: true },
  { id: 3, name: "Dynamic Focus", icon: "record", locked: true },
  { id: 4, name: "Study", icon: "waves", locked: true },
  { id: 5, name: "Deeper Focus", icon: "spiral", locked: true }
];

export const relaxSoundscapes = [
  { id: 1, name: "Relax", icon: "diamond", locked: false },
  { id: 2, name: "8D Odyssey", icon: "eight", locked: true },
  { id: 3, name: "Nature Elements", icon: "leaf", locked: true },
  { id: 4, name: "Spatial Orbit", icon: "orbit", locked: true },
  { id: 5, name: "Hibernation", icon: "snowflake", locked: true },
  { id: 6, name: "Recovery", icon: "sprout", locked: true },
  { id: 7, name: "Wiggly Wisdom", icon: "wisdom", locked: true }
];

export const sleepSoundscapes = [
  { id: 1, name: "Sleep", icon: "moon", locked: false },
  { id: 2, name: "Rainy Outside", icon: "rain", locked: true },
  { id: 3, name: "Wind Down", icon: "wind", locked: true },
  { id: 4, name: "AI Lullaby", icon: "lullaby", locked: true }
];

export const currentTrack = {
  name: "Focus",
  status: "Paused",
  icon: "globe"
};
