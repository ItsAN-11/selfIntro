import type { Metadata } from "next";
import MusicView from "@/components/MusicView";
import { recent, topArtists, topTracks } from "@/data/music";

export const metadata: Metadata = { title: "Musical Mehfil — Anjali Gupta" };

export default function MusicPage() {
  // Hardcoded lists first, then live Spotify data.
  return <MusicView initial={{ live: false, tracks: topTracks, artists: topArtists, recent }} />;
}
