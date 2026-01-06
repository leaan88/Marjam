import React from 'react';

export const GlobeIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <ellipse cx="24" cy="24" rx="8" ry="20" />
    <line x1="4" y1="24" x2="44" y2="24" />
    <path d="M6 16h36" />
    <path d="M6 32h36" />
  </svg>
);

export const DotsIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="1.5" />
    {[...Array(5)].map((_, row) => (
      [...Array(5)].map((_, col) => (
        <circle
          key={`${row}-${col}`}
          cx={12 + col * 6}
          cy={12 + row * 6}
          r="1.5"
          fill="currentColor"
          opacity={(row + col) % 2 === 0 ? 1 : 0.5}
        />
      ))
    ))}
  </svg>
);

export const RecordIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <circle cx="24" cy="24" r="6" />
  </svg>
);

export const WavesIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <path d="M8 24c4-8 8-8 16 0s12 8 16 0" />
    <path d="M8 18c4-6 8-6 16 0s12 6 16 0" />
    <path d="M8 30c4 6 8 6 16 0s12-6 16 0" />
  </svg>
);

export const SpiralIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <path d="M24 24c0-4 4-8 8-8s8 4 8 8-4 8-8 8-6-3-6-6 3-6 6-6 4 2 4 4-2 4-4 4" />
  </svg>
);

export const DiamondIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <path d="M24 8L40 24L24 40L8 24L24 8Z" />
    <path d="M24 14L34 24L24 34L14 24L24 14Z" />
  </svg>
);

export const EightIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <circle cx="24" cy="16" r="6" />
    <circle cx="24" cy="32" r="6" />
  </svg>
);

export const LeafIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <path d="M24 38V18" />
    <path d="M16 30c0-8 8-14 8-14s8 6 8 14" />
    <path d="M20 26c0-4 4-7 4-7s4 3 4 7" />
  </svg>
);

export const OrbitIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <ellipse cx="24" cy="24" rx="14" ry="6" transform="rotate(-30 24 24)" />
    <circle cx="24" cy="24" r="3" fill="currentColor" />
  </svg>
);

export const SnowflakeIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <line x1="24" y1="8" x2="24" y2="40" />
    <line x1="8" y1="24" x2="40" y2="24" />
    <line x1="12" y1="12" x2="36" y2="36" />
    <line x1="36" y1="12" x2="12" y2="36" />
  </svg>
);

export const SproutIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <path d="M24 38V24" />
    <path d="M24 24c-6-2-8-8-8-12 6 0 10 4 8 12" />
    <path d="M24 24c6-2 8-8 8-12-6 0-10 4-8 12" />
  </svg>
);

export const WisdomIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <path d="M16 20c0 0 4-4 8-4s8 4 8 4" />
    <circle cx="20" cy="24" r="2" fill="currentColor" />
    <circle cx="28" cy="24" r="2" fill="currentColor" />
    <path d="M20 32c0 0 2 2 4 2s4-2 4-2" />
  </svg>
);

export const MoonIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <path d="M30 12c-8 0-14 6-14 14s6 14 14 14c-4 0-10-4-10-14s6-14 10-14z" />
  </svg>
);

export const RainIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <path d="M12 20h24" />
    <path d="M16 28l-2 6" />
    <path d="M24 28l-2 6" />
    <path d="M32 28l-2 6" />
    <path d="M20 24l-2 6" />
    <path d="M28 24l-2 6" />
  </svg>
);

export const WindIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <path d="M10 20h20c4 0 6-4 2-6" />
    <path d="M10 28h16c4 0 6 4 2 6" />
    <path d="M14 24h24" />
  </svg>
);

export const LullabyIcon = ({ className }) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} stroke="currentColor" strokeWidth="1.5">
    <circle cx="24" cy="24" r="20" />
    <path d="M18 18c0-4 6-4 6 0v12c0 2-2 4-6 4" />
    <circle cx="12" cy="34" r="4" />
    <path d="M30 14l4-4m0 0l4 4m-4-4v8" />
    <path d="M34 26l2-2m0 0l2 2m-2-2v4" />
  </svg>
);

export const getIconComponent = (iconName) => {
  const icons = {
    globe: GlobeIcon,
    dots: DotsIcon,
    record: RecordIcon,
    waves: WavesIcon,
    spiral: SpiralIcon,
    diamond: DiamondIcon,
    eight: EightIcon,
    leaf: LeafIcon,
    orbit: OrbitIcon,
    snowflake: SnowflakeIcon,
    sprout: SproutIcon,
    wisdom: WisdomIcon,
    moon: MoonIcon,
    rain: RainIcon,
    wind: WindIcon,
    lullaby: LullabyIcon
  };
  return icons[iconName] || GlobeIcon;
};
