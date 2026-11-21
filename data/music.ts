// Musical Mehfil content; fallback when live Spotify data isn't available.

export type MusicCard = {
  title: string;
  artist: string;
  tag: string;
  ar: string;
  url: string;
  img?: string;
  bg?: string;
  ink?: string;
  sun?: string;
  sz?: string;
  sx?: string;
  sy?: string;
  lab?: string;
  fs?: string;
};

export const cards: MusicCard[] = [
  { title: "Playlist", artist: "Spotify", tag: "Playlist", ar: "1 / 1", img: "/images/music/card_vinyl.jpg", url: "https://open.spotify.com/playlist/3IXdHgi2MDqFgnKrxu0TQ0" },
  { title: "Playlist", artist: "Spotify", tag: "Playlist", ar: "1 / 1", img: "/images/music/card_swan.jpg", url: "https://open.spotify.com/playlist/3rqDdtGn5r36OSiiIAOoLv" },
  { title: "Jazz playlist", artist: "Spotify", tag: "Playlist", ar: "9 / 16", img: "/images/music/card_jazz.jpg", url: "https://open.spotify.com/playlist/37i9dQZF1DWZdLqpoFOt65" },
  { title: "Alvida Alvida", artist: "Nabeel Shaukat Ali · Dar-E-Nijaat", tag: "Sufi & OST", ar: "3 / 4", bg: "radial-gradient(120% 100% at 30% 20%, #2F7A6A 0%, #12382F 50%, #061512 100%)", ink: "#E4F0E6", sun: "#CDE7B0", sz: "40%", sx: "50%", sy: "12%", lab: "#2F7A6A", fs: "48px", url: "https://open.spotify.com/track/06qVuHcsPmojVPO2wbLiDk" },
  { title: "Alfaaz", artist: "Hamza Malik, Zain Zohaib", tag: "Indie & Regional", ar: "1 / 1", bg: "linear-gradient(200deg, #D9A69A 0%, #8A4E54 55%, #2E1619 100%)", ink: "#FFF1E8", sun: "#FBE3D3", sz: "30%", sx: "14%", sy: "12%", lab: "#8A4E54", fs: "58px", url: "https://open.spotify.com/track/0tW2gwaRzFQQrgr2UCO56G" },
  { title: "Teri Yaad Yaad Yaad", artist: "Ghulam Ali · Bewafaa", tag: "Ghazal", ar: "3 / 4", bg: "radial-gradient(120% 90% at 50% 0%, #C99A55 0%, #6E4A22 50%, #1E130A 100%)", ink: "#FFF3DE", sun: "#F7E1B0", sz: "52%", sx: "24%", sy: "4%", lab: "#6E4A22", fs: "42px", url: "https://open.spotify.com/track/0fop0xkp8P9b7JTJSDdBB4" },
  { title: "Unreal Unearth", artist: "Hozier", tag: "Album", ar: "1 / 1", img: "/images/music/card_hozier.jpg", url: "https://open.spotify.com/album/0TFpENEamBfIfGISdSTXFB" },
  { title: "Taare", artist: "Farak, 10A, Saswat Balan", tag: "Indie & Regional", ar: "4 / 5", bg: "radial-gradient(1.5px 1.5px at 20% 30%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 70% 18%, #fff 50%, transparent 51%), radial-gradient(1.5px 1.5px at 45% 55%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 82% 46%, #fff 50%, transparent 51%), linear-gradient(180deg, #0B1A3A 0%, #050B1C 100%)", ink: "#E8F0FF", sun: "#C9D8FF", sz: "22%", sx: "62%", sy: "10%", lab: "#2B4A8F", fs: "64px", url: "https://open.spotify.com/track/2iVj11OdEBNIGUv9f7jGPK" },
  { title: "Chandi Jaisa Rang Hai", artist: "Pankaj Udhas", tag: "Ghazal", ar: "1 / 1", bg: "radial-gradient(110% 100% at 50% 20%, #D9D4CB 0%, #6F6A63 50%, #1C1A18 100%)", ink: "#1A1714", sun: "#FFFFFF", sz: "44%", sx: "28%", sy: "6%", lab: "#8E877C", fs: "40px", url: "https://open.spotify.com/track/2txn2EWHY6ekY3FAZOSTHW" },
  { title: "Aamar Praan Jahaa Chaay", artist: "Arijit Singh · Tagore", tag: "Indie & Regional", ar: "4 / 5", bg: "linear-gradient(180deg, #F3ECDD 0 62%, #B3121F 62% 100%)", ink: "#2A0D0D", sun: "#B3121F", sz: "34%", sx: "56%", sy: "12%", lab: "#B3121F", fs: "40px", url: "https://open.spotify.com/track/0BZJUCJrcWavjzTdldnkrw" },
  { title: "When We Feel Young", artist: "Spotify", tag: "Track", ar: "1 / 1", img: "/images/music/card_young.jpg", url: "https://open.spotify.com/track/5gmkDsfJC1fYBZoWGBkL1E" },
  { title: "Grace", artist: "Jeff Buckley", tag: "Album", ar: "1 / 1", img: "/images/music/card_grace.jpg", url: "https://open.spotify.com/album/7yQtjAjhtNi76KRu05XWFS" },
];

export const profile = {
  name: "anjali",
  label: "Premium user",
  playlistsCount: 7,
  photo: "/images/music/profile.jpg",
};

export const playlists = [
  { name: "ग़ज़ाल-ए-सुर्ख़ 🥀", note: "ghazals, in deep red", img: "/images/playlists/ghazal-e-surkh.jpg", url: "https://open.spotify.com/playlist/6jw0VaOzkTbH7iRS2LyC3A" },
  { name: "Don't save her", note: "my playlist", img: "/images/playlists/dont-save-her.jpg", url: "https://open.spotify.com/playlist/4jqv8ToRIHEX3Tl5pQpArS" },
  { name: "Oh, all this endless rage", note: "my playlist", img: "/images/playlists/endless-rage.jpg", url: "https://open.spotify.com/playlist/53CTvhqPe3OvJEhum0Z7NW" },
];

export type Track = { title: string; artist: string; url: string; img: string };

export const topTracks: Track[] = [
  { title: "Alfaaz", artist: "Hamza Malik, Zain Zohaib", url: "https://open.spotify.com/track/0tW2gwaRzFQQrgr2UCO56G", img: "/images/tracks/tt1.jpg" },
  { title: "Taare", artist: "Farak, 10A, Saswat Balan", url: "https://open.spotify.com/track/2iVj11OdEBNIGUv9f7jGPK", img: "/images/tracks/tt2.jpg" },
  { title: "Sanu Bhul Gayi Khudayi", artist: "Nusrat Fateh Ali Khan", url: "https://open.spotify.com/track/190xSykP9hR0pdgvJDhhdY", img: "/images/tracks/tt3.jpg" },
  { title: "Apni Dhun Mein Rehta Hoon", artist: "Ghulam Ali", url: "https://open.spotify.com/track/28pzXqvc67kCzehI85cD5w", img: "/images/tracks/tt4.jpg" },
  { title: "Us Mod Se Shuru Karein", artist: "Jagjit Singh & Chitra Singh", url: "https://open.spotify.com/track/6RrGFweUMfgRQ2xwnV1a8Y", img: "/images/tracks/tt5.jpg" },
];

export type Artist = { name: string; genre: string; url: string; img: string };

export const topArtists: Artist[] = [
  { name: "Nusrat Fateh Ali Khan", genre: "qawwali, sufi", url: "https://open.spotify.com/artist/5HcunTidTUrOaf8V0iJcvl", img: "/images/artists/ta1.jpg" },
  { name: "Hozier", genre: "soul, indie folk", url: "https://open.spotify.com/artist/2FXC3k01G6Gw61bmprjgqS", img: "/images/artists/ta2.jpg" },
  { name: "Jagjit Singh", genre: "ghazal", url: "https://open.spotify.com/artist/2ijWbN5KykTYiBoVmhzCTU", img: "/images/artists/ta3.jpg" },
  { name: "Prateek Kuhad", genre: "indie, singer-songwriter", url: "https://open.spotify.com/artist/0tC995Rfn9k2l7nqgCZsV7", img: "/images/artists/ta4.jpg" },
];

export const recent = {
  title: "Marry the man",
  artist: "Farina",
  album: "30 or 40?",
  url: "https://open.spotify.com/track/08PnwXR8S1JctN7N1CS1C8",
};

export const quotes = {
  middle: { text: "Music is the shorthand of emotion.", by: "Leo Tolstoy" },
  end: { text: "Music has a power of forming the character.", by: "Aristotle" },
};
