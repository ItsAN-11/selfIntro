import Link from "next/link";
import { site } from "@/data/site";
import { FilmIcon, MusicIcon } from "./icons";

const tab =
  "group inline-flex min-h-12 items-center gap-2.5 rounded-l-full border-[1.5px] border-r-0 py-0 pl-3.5 pr-3.5 text-sm font-bold transition-all duration-300 hover:pr-5";

/** The two "other resumes", pinned to the right edge. They open out on hover. */
export default function SideTabs() {
  return (
    <nav aria-label="My other resumes" className="fixed right-0 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-2.5 md:flex">
      <Link href="/music" aria-label="Spotify resume" className={`${tab} border-[#1ED760] bg-bg text-[#1ED760] hover:bg-[#1ED760] hover:text-[#0E0C0A]`}>
        <MusicIcon />
        <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-300 group-hover:max-w-40 group-focus-visible:max-w-40">
          Spotify resume
        </span>
      </Link>
      {site.showCinema && (
        <Link href="/cinema" aria-label="Netflix resume" className={`${tab} border-[#E50914] bg-bg text-[#FF4A52] hover:bg-[#E50914] hover:text-white`}>
          <FilmIcon />
          <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width] duration-300 group-hover:max-w-40 group-focus-visible:max-w-40">
            Netflix resume
          </span>
        </Link>
      )}
    </nav>
  );
}
