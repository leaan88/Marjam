// Mock data for Marjam - Loop Ideas Jamming App

export const banners = [
  {
    id: 1,
    badge: "CORE LIBRARY",
    title: "Your Sound Foundation",
    image: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1200",
    bgStyle: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)"
  },
  {
    id: 2,
    badge: "AI POWERED",
    title: "Generate Unique Loops",
    image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200",
    bgStyle: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)"
  },
  {
    id: 3,
    badge: "CREATE",
    title: "Build Your Songs",
    image: "https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1200",
    bgStyle: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)"
  }
];

// Mood parameters with tier access
export const moodParameters = [
  // Free tier moods
  { id: 1, name: "Peaceful", locked: false, tier: "free" },
  { id: 2, name: "Focus", locked: false, tier: "free" },
  { id: 3, name: "Groovy", locked: false, tier: "free" },
  { id: 4, name: "Chill", locked: false, tier: "free" },
  // Premium tier moods
  { id: 5, name: "Introspective", locked: true, tier: "premium" },
  { id: 6, name: "Uplift", locked: true, tier: "premium" },
  { id: 7, name: "Darker", locked: true, tier: "premium" },
  { id: 8, name: "Lighter", locked: true, tier: "premium" },
  { id: 9, name: "Banging", locked: true, tier: "premium" },
  { id: 10, name: "Dry", locked: true, tier: "premium" },
  { id: 11, name: "Wet", locked: true, tier: "premium" },
  { id: 12, name: "Minimal", locked: true, tier: "premium" },
  { id: 13, name: "Complex", locked: true, tier: "premium" },
  { id: 14, name: "Hypnotic", locked: true, tier: "premium" },
  { id: 15, name: "Energetic", locked: true, tier: "premium" },
  // Admin only moods
  { id: 16, name: "Aggressive", locked: true, tier: "admin" },
  { id: 17, name: "Dreamy", locked: true, tier: "admin" }
];

// Empty arrays - loops now come from Core Library
export const drumLoops = [];
export const bassLoops = [];
export const synthLoops = [];
export const fxLoops = [];

export const currentLoop = {
  name: "Select a loop",
  bpm: 120,
  icon: "drums",
  bars: 8
};

