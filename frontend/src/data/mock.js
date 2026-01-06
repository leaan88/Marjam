// Mock data for Endel clone

export const banners = [
  {
    id: 1,
    badge: "SPECIAL OFFER",
    title: "Get 30% off Premium",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80",
    bgStyle: "linear-gradient(135deg, rgba(139, 69, 116, 0.9) 0%, rgba(47, 79, 79, 0.9) 50%, rgba(25, 25, 112, 0.9) 100%)"
  },
  {
    id: 2,
    badge: "MAJOR UPDATE",
    title: "Endel for ADHD",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    bgStyle: "linear-gradient(135deg, rgba(75, 0, 130, 0.9) 0%, rgba(138, 43, 226, 0.9) 50%, rgba(255, 140, 0, 0.9) 100%)"
  },
  {
    id: 3,
    badge: "NEW",
    title: "Endel Merch Available Now",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    bgStyle: "linear-gradient(135deg, rgba(0, 100, 0, 0.9) 0%, rgba(34, 139, 34, 0.9) 50%, rgba(0, 128, 128, 0.9) 100%)"
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
