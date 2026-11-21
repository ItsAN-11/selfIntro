export type Project = {
  id: "ondc" | "unizap" | "rydex";
  kind: "Work" | "Freelance";
  title: string;
  org: string;
  tagline: string;
  /** One-paragraph summary used on the homepage work cards. */
  summary: string;
  where: string;
  when: string;
  status: "Ongoing" | "Live" | "In progress";
  problem: string;
  impact: string;
  built: string[];
  /** Simple flow chips, used when there is no full diagram. */
  flow?: string[];
  stack: string[];
  homeTags: string[];
};

export const projects: Project[] = [
  {
    id: "ondc",
    kind: "Work",
    title: "ONDC seller network",
    org: "Senrysa · Unizap × ONDC",
    tagline: "Bringing Unizap sellers onto India’s open commerce network",
    summary:
      "I brought 100 active sellers onto ONDC and keep their orders moving for buyers all over India, through apps like Digihaat, Farmlokal and Bajaj. I also owned IGM 2.0, the Issue & Grievance flow, from start to finish: every complaint that comes in, and every callback that goes back to the buyer.",
    where: "Senrysa Technologies",
    when: "2025 – now",
    status: "Ongoing",
    problem:
      "Sellers on Unizap needed to reach buyers across India through ONDC, which means answering every buyer app’s search, order and issue calls correctly and on time.",
    impact:
      "100 sellers live and selling pan-India, with complaints handled through a flow I own.",
    built: [
      "Onboarded 100 active sellers onto the network and kept their catalogues and orders in sync with buyer apps across India",
      "Owned IGM 2.0 end to end: receiving issues from buyer apps, tracking them through resolution and sending every status callback back on time",
      "Built the orchestrator flow: each request fans out to the Unizap microservices it needs, and their answers come back as one ONDC callback to the buyer app",
    ],
    stack: ["Beckn protocol", "Node.js", "Kafka", "Kong Gateway", "Microservices"],
    homeTags: ["Beckn protocol", "Node.js", "Kafka", "Kong Gateway", "Async callbacks"],
  },
  {
    id: "unizap",
    kind: "Work",
    title: "Unizap commerce platform",
    org: "Senrysa · Unizap",
    tagline: "An all-in-one e-commerce platform: storefront, seller dashboard, delivery panel, master catalog and more",
    summary:
      "Unizap is an all-in-one e-commerce platform: storefront, seller dashboard, delivery panel, master catalog and more. I work across its account, order, catalog and utility services and the orchestrator, and own seller coupons, wishlists, ratings and reviews end to end.",
    where: "Senrysa Technologies",
    when: "2025 – now",
    status: "Live",
    problem:
      "Unizap gives sellers every tool they need to sell online in one place: a storefront, a seller dashboard, a delivery panel, a master catalog and more. Behind them sit separate microservices that all have to work together reliably.",
    impact:
      "Sellers on Unizap can run offers and hear from their customers, through features I built and own across the platform.",
    built: [
      "Worked across the account, order, catalog and utility services, and the orchestrator that ties them together",
      "Own seller coupons, wishlists, ratings and reviews end to end, from the database to the screens",
      "Work on both the frontend and the backend, so features ship whole rather than half",
    ],
    flow: ["Storefront & seller tools", "Orchestrator", "Account · Order · Catalog · Utility services"],
    stack: ["Spring Boot", "Microservices", "REST APIs", "MongoDB", "Full-stack"],
    homeTags: ["Spring Boot", "REST APIs", "MongoDB", "Full-stack"],
  },
  {
    id: "rydex",
    kind: "Freelance",
    title: "Rydex, ride-hailing",
    org: "Freelance · Rydex",
    tagline: "The rider app and the admin panel behind a ride-hailing service",
    summary:
      "My freelance build. I made the rider app, with booking, coupons and live driver tracking, and the admin panel where the team approves rides, verifies drivers, and manages fares, payouts, reports and complaints.",
    where: "Freelance client",
    when: "2026",
    status: "In progress",
    problem:
      "Riders needed a simple way to book a cab, save with an offer and see where their driver is. The team running Rydex needed one place to approve rides, verify drivers and keep the whole service in check.",
    impact: "Riders get a smooth booking experience, and the Rydex team runs rides, drivers, money and support from a single panel.",
    built: [
      "Rider app: booking, coupons and live driver tracking",
      "Admin panel: approve and manage rides, verify drivers, manage riders, and watch everything on a live map",
      "Fares, coupons, payments, payouts and reports, all managed from the panel",
      "A support desk for complaints, so nothing raised by a rider or driver gets lost",
    ],
    flow: ["Rider app", "Rydex backend", "Admin panel"],
    stack: ["Geolocation", "Real-time updates", "Admin dashboard", "Promo engine", "REST APIs"],
    homeTags: ["Geolocation", "Real-time updates", "Promo engine", "REST APIs"],
  },
];
