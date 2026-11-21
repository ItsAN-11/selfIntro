type P = { size?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const GitHubIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="M9 19c-4 1.5-4-2-6-2.5M15 22v-3.5a3 3 0 0 0-.9-2.4c3-.3 6-1.5 6-6.6a5.2 5.2 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.1-.3-3.7 1.4a12.6 12.6 0 0 0-6.6 0C5.7 2 4.6 2.3 4.6 2.3a4.8 4.8 0 0 0-.1 3.6A5.2 5.2 0 0 0 3 9.5c0 5.1 3 6.3 6 6.6a3 3 0 0 0-.9 2.4V22" />
  </svg>
);

export const LinkedInIcon = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7" />
  </svg>
);

export const MusicIcon = ({ size = 20 }: P) => (
  <svg {...base(size)} strokeWidth={2}>
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

export const FilmIcon = ({ size = 20 }: P) => (
  <svg {...base(size)} strokeWidth={2}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M3 7l4-4M9 7l4-4M15 7l4-4" />
    <path d="M10 11v5l4-2.5z" fill="currentColor" />
  </svg>
);

export const SpotifyLogo = ({ size = 28 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden fill="currentColor">
    <path d="M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24zm5.5 17.3a.75.75 0 0 1-1 .25c-2.8-1.7-6.4-2.1-10.6-1.2a.75.75 0 1 1-.33-1.46c4.6-1 8.6-.6 11.7 1.4.35.2.46.66.24 1zm1.47-3.27a.94.94 0 0 1-1.29.31c-3.2-2-8.1-2.55-11.9-1.4a.94.94 0 1 1-.55-1.8c4.3-1.3 9.7-.67 13.4 1.6.44.27.58.85.31 1.29zm.13-3.4C15.2 8.33 8.8 8.12 5.1 9.24a1.13 1.13 0 1 1-.65-2.16c4.25-1.29 11.3-1.04 15.8 1.6a1.13 1.13 0 0 1-1.15 1.95z" />
  </svg>
);
