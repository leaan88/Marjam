// Mock data for Marjam - Loop Ideas Jamming App

export const banners = [
  {
    id: 1,
    badge: "SPECIAL OFFER",
    title: "Get 30% off Premium",
    image: "https://images.pexels.com/photos/164938/pexels-photo-164938.jpeg?auto=compress&cs=tinysrgb&w=1200",
    bgStyle: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)"
  },
  {
    id: 2,
    badge: "NEW LOOPS",
    title: "Fresh Inspiration Daily",
    image: "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=1200",
    bgStyle: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)"
  },
  {
    id: 3,
    badge: "PRODUCERS",
    title: "Download 8/16/32 Bar Loops",
    image: "https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg?auto=compress&cs=tinysrgb&w=1200",
    bgStyle: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)"
  }
];

export const moodParameters = [
  { id: 1, name: "Peaceful", locked: false },
  { id: 2, name: "Focus", locked: false },
  { id: 3, name: "Groovy", locked: false },
  { id: 4, name: "Introspective", locked: true },
  { id: 5, name: "Uplift", locked: true },
  { id: 6, name: "Darker", locked: true },
  { id: 7, name: "Lighter", locked: true },
  { id: 8, name: "Banging", locked: true },
  { id: 9, name: "Dry", locked: true },
  { id: 10, name: "Wet", locked: true },
  { id: 11, name: "Minimal", locked: true },
  { id: 12, name: "Complex", locked: true },
  { id: 13, name: "Hypnotic", locked: true },
  { id: 14, name: "Energetic", locked: true },
  { id: 15, name: "Chill", locked: true },
  { id: 16, name: "Aggressive", locked: true },
  { id: 17, name: "Dreamy", locked: true }
];

export const drumLoops = [
  { id: 1, name: "Kick Foundation", icon: "drums", bpm: 120, locked: false },
  { id: 2, name: "Snare Groove", icon: "snare", bpm: 128, locked: true },
  { id: 3, name: "Hi-Hat Shuffle", icon: "hihat", bpm: 125, locked: true },
  { id: 4, name: "Percussion Layer", icon: "percussion", bpm: 122, locked: true },
  { id: 5, name: "Full Kit", icon: "fullkit", bpm: 130, locked: true }
];

export const bassLoops = [
  { id: 1, name: "Sub Bass", icon: "subbass", bpm: 120, locked: false },
  { id: 2, name: "Funk Bass", icon: "funkbass", bpm: 115, locked: true },
  { id: 3, name: "808 Pattern", icon: "bass808", bpm: 140, locked: true },
  { id: 4, name: "Acid Line", icon: "acidbass", bpm: 128, locked: true },
  { id: 5, name: "Deep Groove", icon: "deepbass", bpm: 118, locked: true }
];

export const synthLoops = [
  { id: 1, name: "Pad Atmosphere", icon: "pad", bpm: 120, locked: false },
  { id: 2, name: "Lead Melody", icon: "lead", bpm: 128, locked: true },
  { id: 3, name: "Arp Sequence", icon: "arp", bpm: 135, locked: true },
  { id: 4, name: "Chord Progression", icon: "chords", bpm: 122, locked: true },
  { id: 5, name: "Texture Layer", icon: "texture", bpm: 110, locked: true }
];

export const fxLoops = [
  { id: 1, name: "Risers", icon: "riser", bpm: 128, locked: false },
  { id: 2, name: "Impacts", icon: "impact", bpm: 128, locked: true },
  { id: 3, name: "Sweeps", icon: "sweep", bpm: 128, locked: true },
  { id: 4, name: "Transitions", icon: "transition", bpm: 128, locked: true }
];

export const currentLoop = {
  name: "Kick Foundation",
  bpm: 120,
  icon: "drums",
  bars: 8
};

