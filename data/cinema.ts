// Cinematic Diary content (placeholders for now).

export type FilmTag = "Favourite" | "Watched" | "Up next";

export type Film = {
  title: string;
  year: string;
  rating: string;
  review: string;
  tag: FilmTag;
  ar: string;
  bg: string;
  poster?: string;
  url?: string;
};

const tags: [FilmTag, string, string][] = [
  ["Favourite", "2 / 3", "#241E19"],
  ["Watched", "2 / 3", "#1E1A16"],
  ["Favourite", "3 / 4", "#2A221C"],
  ["Up next", "2 / 3", "#1A1714"],
  ["Watched", "3 / 4", "#221D18"],
  ["Favourite", "2 / 3", "#2B231D"],
  ["Up next", "3 / 4", "#1C1916"],
  ["Watched", "2 / 3", "#231E19"],
  ["Favourite", "3 / 4", "#28211B"],
  ["Watched", "2 / 3", "#1F1A16"],
  ["Up next", "2 / 3", "#1B1815"],
  ["Favourite", "2 / 3", "#2A221C"],
];

export const films: Film[] = tags.map(([tag, ar, bg]) => ({
  title: "[Film title]",
  year: "[Year]",
  rating: "[★ /5]",
  review: "[One-line review]",
  tag,
  ar,
  bg,
}));

export const cineProfile = {
  since: "[year]",
  name: "ANJALI",
  watched: "[N]",
  photo: "", // e.g. "/images/cinema/me.jpg"
};

export const filmLists = [
  { name: "Films that stayed with me", count: "[N]" },
  { name: "Comfort rewatches", count: "[N]" },
  { name: "Best soundtracks", count: "[N]" },
];

export const topFilms = Array.from({ length: 5 }, () => ({ title: "[Film title]", meta: "[Director] · [Year]" }));

export const directors = Array.from({ length: 4 }, () => ({ name: "[Director]", fav: "[Favourite film of theirs]" }));

export const filmQuote = { text: "[Your favourite line from a film]", by: "[Film, year]" };
