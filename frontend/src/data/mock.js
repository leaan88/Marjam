// Mock data for Endel clone

export const banners = [
  {
    id: 1,
    badge: "SPECIAL OFFER",
    title: "Get 30% off Premium",
    image: "https://images.pexels.com/photos/70330/pexels-photo-70330.jpeg?auto=compress&cs=tinysrgb&w=1200",
    bgStyle: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)"
  },
  {
    id: 2,
    badge: "MAJOR UPDATE",
    title: "Endel for ADHD",
    image: "https://images.pexels.com/photos/85773/pexels-photo-85773.jpeg?auto=compress&cs=tinysrgb&w=1200",
    bgStyle: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)"
  },
  {
    id: 3,
    badge: "NEW",
    title: "Endel Merch Available Now",
    image: "https://images.pexels.com/photos/69776/tulips-bed-colorful-color-69776.jpeg?auto=compress&cs=tinysrgb&w=1200",
    bgStyle: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 100%)"
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
