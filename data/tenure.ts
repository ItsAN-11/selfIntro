export type Tenure = {
  year: string;
  kind: string;
  org: string;
  when: string;
  role: string;
  tags: string;
  stackLine: string;
  place: string;
  note: string;
  photo: string;
  /** Optional second photo that fades in and out over the first. */
  photo2?: string;
  /** Logo images are shown contained on white rather than cropped. */
  logo?: boolean;
};

export const tenure: Tenure[] = [
  {
    year: "2026",
    kind: "Freelance",
    org: "Independent",
    when: "2026 – Present",
    role: "Freelance Backend Developer",
    tags: "@spring-boot @nestjs @postgres",
    stackLine: "Spring Boot · NestJS · Node.js · PostgreSQL · Redis · WebSocket",
    place: "Remote · Kolkata, India",
    note: "Alongside my day job, I build for startups, agencies and small businesses: the rider app and admin panel of Rydex, a ride-hailing service, plus managing existing websites and making landing pages that bring in enquiries.",
    photo: "/images/tenure/rydex_logo.jpg",
    logo: true,
  },
  {
    year: "2025",
    kind: "Work",
    org: "Senrysa Technologies",
    when: "Nov 2025 – Present",
    role: "Junior Software Developer",
    tags: "@spring-boot @nestjs @node.js",
    stackLine: "Spring Boot · NestJS · Node.js · Kafka · Kong · PostgreSQL · MongoDB",
    place: "Kolkata, India",
    note: "I work on two of Senrysa’s products. On Unizap, the company’s commerce platform, I own seller-side coupons, wishlists, ratings and reviews across frontend and backend. On ONDC, I onboarded 100 active sellers and own IGM 2.0 end to end.",
    photo: "/images/tenure/office1.jpg",
  },
  {
    year: "2025",
    kind: "Internship",
    org: "Senrysa Technologies",
    when: "Aug 2025 – Nov 2025",
    role: "Software Developer Intern",
    tags: "@spring-boot @node.js",
    stackLine: "Spring Boot · Node.js · MongoDB · PostgreSQL",
    place: "Kolkata, India",
    note: "Spent my three-month internship on UniQR, one of Senrysa’s products. It was my first real codebase, and it turned into a full-time role.",
    photo: "/images/tenure/office2.jpg",
  },
  {
    year: "2021",
    kind: "Education",
    org: "Techno India Institute of Technology",
    when: "2021 – 2024",
    role: "Bachelor of Computer Applications",
    tags: "CGPA 8.64",
    stackLine: "Techno India Institute of Technology · BCA · CGPA 8.64",
    place: "Kolkata, India",
    note: "Where it all started. I walked in curious about how software works and spent three years finding out: writing my first programs, learning data structures, databases and the web, and building small projects until coding stopped being a subject and became the thing I wanted to do for a living. I graduated with a CGPA of 8.64.",
    photo: "/images/tenure/college.jpg",
    photo2: "/images/tenure/freelance.jpg",
  },
];
