import { getMusicData } from "@/lib/spotify";

/** GET /api/spotify → { live, tracks, artists, recent } (cached about an hour). */
export async function GET() {
  return Response.json(await getMusicData());
}
