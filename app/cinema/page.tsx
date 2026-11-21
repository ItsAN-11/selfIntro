import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CinemaView from "@/components/CinemaView";
import { site } from "@/data/site";

export const metadata: Metadata = { title: "Cinematic Diary — Anjali Gupta" };

export default function CinemaPage() {
  if (!site.showCinema) notFound();
  return <CinemaView />;
}
