# selfIntro

```json
{
  "name": "Anjali Gupta",
  "role": "Full Stack Developer (backend-focused)",
  "location": "Howrah, India",
  "currently": "Junior Software Developer @ Senrysa Technologies",
  "building": "Unizap × ONDC — Government of India's open network for digital commerce",
  "stack": ["Spring Boot", "Node.js", "Kafka", "MongoDB", "Next.js"],
  "offDuty": ["teaching CS", "ghazals", "cinema", "chai"],
  "links": {
    "github": "https://github.com/ItsAN-11",
    "linkedin": "https://www.linkedin.com/in/anjali-gupta-0318b9264"
  }
}
```

## Sections

| Route | What it is |
|---|---|
| `/` | Landing: a 3D film reel that unrolls into the site |
| `/home` | About, work highlights, contact form and resume |
| `/projects` | Filmography: professional tenure, freelance and client work |
| `/music` | Musical Mehfil: Spotify-style resume with live top tracks and song recommendations |
| `/cinema` | Cinematic Diary: Netflix-style resume (hidden for now) |

## Tech stack

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · GSAP · Resend (emails) · Spotify Web API · Vercel

## Project layout

```
app/          routes, server actions (emails), /api/spotify
components/   UI pieces: reel, cursor, music & cinema views, forms
data/         all editable content: site info, projects, music, cinema
lib/          Spotify client, small hooks
public/       images and resume.pdf
```

## Run locally

```bash
npm install
cp .env.example .env.local   # add RESEND_API_KEY, Spotify keys (optional)
npm run dev
```
