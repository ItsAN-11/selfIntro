import { cacheLife } from "next/cache";
import { recent as fallbackRecent, topArtists as fallbackArtists, topTracks as fallbackTracks, type Artist, type Track } from "@/data/music";

export type MusicData = {
  live: boolean;
  tracks: Track[];
  artists: Artist[];
  recent: { title: string; artist: string; album: string; url: string; img?: string };
};

const fallback: MusicData = { live: false, tracks: fallbackTracks, artists: fallbackArtists, recent: fallbackRecent };

async function accessToken() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!id || !secret || !refresh) return null;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refresh }),
  });
  if (!res.ok) return null;
  return ((await res.json()) as { access_token: string }).access_token;
}

type SpImage = { url: string };
type SpTrack = { name: string; external_urls: { spotify: string }; artists: { name: string }[]; album: { name: string; images: SpImage[] } };
type SpArtist = { name: string; genres: string[]; external_urls: { spotify: string }; images: SpImage[] };

/** Top tracks, artists and last played song; falls back to data/music.ts. */
export async function getMusicData(): Promise<MusicData> {
  "use cache";
  cacheLife("hours");
  try {
    const token = await accessToken();
    if (!token) return fallback;
    const get = (path: string) =>
      fetch(`https://api.spotify.com/v1${path}`, { headers: { Authorization: `Bearer ${token}` } }).then((r) => (r.ok ? r.json() : null));

    const [tt, ta, rp] = await Promise.all([
      get("/me/top/tracks?time_range=short_term&limit=5"),
      get("/me/top/artists?time_range=short_term&limit=4"),
      get("/me/player/recently-played?limit=1"),
    ]);

    const tracks: Track[] = (tt?.items as SpTrack[] | undefined)?.map((t) => ({
      title: t.name,
      artist: t.artists.map((a) => a.name).join(", "),
      url: t.external_urls.spotify,
      img: t.album.images[0]?.url ?? "",
    })) ?? [];
    const artists: Artist[] = (ta?.items as SpArtist[] | undefined)?.map((a) => ({
      name: a.name,
      genre: a.genres.slice(0, 2).join(", ") || "artist",
      url: a.external_urls.spotify,
      img: a.images[0]?.url ?? "",
    })) ?? [];
    const last = (rp?.items as { track: SpTrack }[] | undefined)?.[0]?.track;

    return {
      live: true,
      tracks: tracks.length >= 3 ? tracks : fallback.tracks,
      artists: artists.length >= 2 ? artists : fallback.artists,
      recent: last
        ? {
            title: last.name,
            artist: last.artists.map((a) => a.name).join(", "),
            album: last.album.name,
            url: last.external_urls.spotify,
            img: last.album.images[0]?.url,
          }
        : fallback.recent,
    };
  } catch {
    return fallback;
  }
}
