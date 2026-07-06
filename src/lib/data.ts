export interface Project {
  name: string;
  label: string;
  tagline: string;
  description: string;
  highlights: string[];
  tech: string[];
  image: "piggyway" | "studypilot" | "uqask" | "nbf";
  live?: string;
  github?: string;
  wechat?: string;
}

export interface Role {
  company: string;
  role: string;
  location: string;
  period: string;
  summary: string;
  points: string[];
  tech: string[];
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Degree {
  degree: string;
  school: string;
}

export const profile = {
  name: "Zane Wang",
  role: "Full Stack Developer",
  location: "Melbourne, Australia",
  email: "zianwang9911@gmail.com",
  phone: "0447 435 758",
  phoneHref: "tel:+61447435758",
  github: "https://github.com/lewiswang0516",
  linkedin: "https://www.linkedin.com/in/zian-wang-39081b225/",
  instagram: "https://www.instagram.com/zianwangw",
  resume: "/Zane-Wang-Resume.pdf",
  availability: "Open to opportunities",
  intro:
    "Five plus years designing, building and running scalable web systems in production: React and Next.js up front, Node.js and Python behind, PostgreSQL underneath, deployed on AWS and GCP. I own services end to end and use AI tooling to ship faster without lowering the bar.",
};

export const projects: Project[] = [
  {
    name: "Piggy Way",
    label: "Production / E-commerce",
    tagline: "A boutique storefront for guinea pig and rabbit supplies.",
    description:
      "A production e-commerce platform on Next.js 16 and React 19, live at piggyway.com.au. The frontend acts as a BFF layer that proxies a dedicated Hono/Bun backend with a Directus CMS upstream, so editors publish content without deploys. Stripe powers checkout, NextAuth handles Google and email sign-in, and guest carts survive refreshes through session tokens.",
    highlights: [
      "BFF architecture keeps credentials server-side, with silent token refresh and guest cart sessions",
      "Stripe checkout, Cloudflare Turnstile and CMS draft preview wired end to end",
      "Component library documented in Storybook and tested with Vitest browser mode",
    ],
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "NextAuth",
      "Stripe",
      "Hono",
      "Bun",
      "PostgreSQL",
      "Directus",
    ],
    image: "piggyway",
    live: "https://piggyway.com.au",
    github: "https://github.com/piggyway/piggy-frontend",
  },
  {
    name: "Study Pilot",
    label: "SaaS / EdTech",
    tagline: "A past-exam practice platform for university subjects.",
    description:
      "A bilingual question bank where students drill past papers under real constraints: weekly unlock schedules, timed sessions and a single active device per account, enforced through Supabase Realtime. Questions are embedded with bge-m3 for semantic search, and practice state survives reloads through a persisted store.",
    highlights: [
      "Single-device session guard kicks a stale login within seconds via Realtime",
      "Server actions with tagged caches and a mapper layer keep DB shapes out of the UI",
      "English and Chinese locales with translation key parity enforced in CI",
    ],
    tech: [
      "Next.js",
      "Supabase",
      "PostgreSQL",
      "Zustand",
      "next-intl",
      "Tailwind v4",
      "bge-m3",
    ],
    image: "studypilot",
    live: "https://studypilot.lewiswang.com.au",
    github: "https://github.com/lewiswang0516/study-pilot",
  },
  {
    name: "UQ Ask Anything",
    label: "AI / Agentic RAG",
    tagline: "A RAG service answering UQ course questions, grounded by design.",
    description:
      "A planner-routed agentic RAG pipeline over Postgres and pgvector with six retrieval modes, from SQL filtering to bge-m3 semantic and RRF hybrid search. High-risk enrolment facts such as prerequisites and fees come from deterministic code, never from the model, and an answerability gate refuses to answer when evidence is missing.",
    highlights: [
      "The LLM planner fills validated filter slots only; SQL is assembled from bound parameters",
      "Strict deterministic-vs-LLM boundary with citation-guarded answer drafting",
      "Pluggable model backend across Ollama, DeepSeek and Bedrock",
    ],
    tech: [
      "Python",
      "FastAPI",
      "LangGraph",
      "PostgreSQL",
      "pgvector",
      "bge-m3",
      "React",
    ],
    image: "uqask",
    live: "https://uqaskanything.lewiswang.com.au/",
    github: "https://github.com/lewiswang0516/uqaskanything",
  },
  {
    name: "Nothing But Fun",
    label: "WeChat Mini Program / Community",
    tagline: "A community lifestyle mini program for Brisbane.",
    description:
      "A community lifestyle WeChat Mini Program built with Taro and Node.js, serving event registration, secondhand trading and rental services for the Brisbane Chinese community. Content is managed through Directus, media runs on Cloudinary, and the backend deploys on Railway.",
    highlights: [
      "Event registration, secondhand trading and rentals in one mini program",
      "Taro codebase targeting the WeChat runtime with NutUI and Tailwind",
      "Node.js and Express API over PostgreSQL with Drizzle ORM",
    ],
    tech: [
      "Taro",
      "React",
      "TypeScript",
      "NutUI",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Drizzle",
      "Cloudinary",
    ],
    image: "nbf",
    github: "https://github.com/lewiswang0516/nothing-but-fun",
    wechat: "微信搜索布好玩bris小程序",
  },
];

export const stats = [
  { label: "Years of experience", value: 5, suffix: "+" },
  { label: "Companies", value: 5, suffix: "" },
  { label: "Featured projects", value: 4, suffix: "" },
];

export const roles: Role[] = [
  {
    company: "Broadsheet Media",
    role: "Full Stack Developer",
    location: "Melbourne, Australia",
    period: "Feb 2025 - Jun 2026",
    summary:
      "Built and ran the publisher's web platform: responsive Next.js frontend, Node.js APIs and an event-bus service on GCP.",
    points: [
      "Shipped scalable RESTful APIs in Node.js and TypeScript with Redis in front for performance",
      "Deployed services on Cloud Run, GKE and Pub/Sub, with Docker and Kubernetes CI/CD pipelines for the CMS",
    ],
    tech: ["Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "Redis", "GCP", "Kubernetes"],
  },
  {
    company: "AnyStay",
    role: "Full Stack Developer",
    location: "Brisbane, Australia",
    period: "Dec 2023 - Dec 2024",
    summary:
      "Built the stays marketplace across hosts, guests and memberships on React, GraphQL and an AWS serverless backend.",
    points: [
      "Designed DynamoDB tables and access patterns for high-throughput, low-latency workloads",
      "Decoupled core systems with an event-driven service bus; deployed via Amplify and Lambda pipelines",
    ],
    tech: ["React", "Redux", "GraphQL", "Node.js", "DynamoDB", "AWS", "Jest", "Selenium"],
  },
  {
    company: "TikTok",
    role: "Full Stack Developer",
    location: "Beijing, China",
    period: "Jul 2023 - Dec 2023",
    summary:
      "Built web middleware and APIs for a platform operating at social-media scale.",
    points: [
      "Cut middleware latency by 60% with a Redis-backed queue system",
      "Introduced Kafka-based event-driven architecture; ran consistent dev/staging/prod on Docker, Kubernetes and Terraform",
    ],
    tech: ["React", "TypeScript", "Express", "PostgreSQL", "Redis", "Kafka", "Kubernetes", "Terraform"],
  },
  {
    company: "Kexing EasyGo",
    role: "Lead Full Stack Developer",
    location: "Brisbane, Australia",
    period: "Nov 2020 - Nov 2022",
    summary:
      "Led frontend and backend developers building an academic companion app for University of Queensland students.",
    points: [
      "Built the app in React, React Native and Node.js with a Kafka event bus between microservices",
      "Established the Jest testing standard with coverage thresholds enforced in CI; provisioned AWS with Terraform",
    ],
    tech: ["React", "React Native", "TypeScript", "Node.js", "PostgreSQL", "Kafka", "AWS", "Terraform"],
  },
  {
    company: "Graviti",
    role: "Full Stack Developer",
    location: "Shanghai, China (Hybrid)",
    period: "Jan 2021 - Jan 2022",
    summary:
      "Built dataset tooling for AI development: a React dashboard and a distributed Python web-crawling system.",
    points: [
      "Coordinated distributed crawlers through a RabbitMQ job queue, decoupling scheduling from ingestion",
      "Developed Golang APIs behind a custom gateway; scaled crawler workers elastically on Kubernetes",
    ],
    tech: ["React", "TypeScript", "Python", "Golang", "MongoDB", "RabbitMQ", "Kubernetes"],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "Golang"],
  },
  {
    title: "Frontend",
    items: ["React", "Next.js", "React Native", "Redux", "TailwindCSS", "HTML5 / CSS3"],
  },
  {
    title: "Backend",
    items: ["Node.js", "Express", "RESTful APIs", "GraphQL", "Jest"],
  },
  {
    title: "Data",
    items: ["PostgreSQL", "MongoDB", "DynamoDB", "Redis", "Cloud SQL", "RDS"],
  },
  {
    title: "Cloud & DevOps",
    items: ["AWS", "GCP", "Azure", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Jenkins"],
  },
  {
    title: "Messaging",
    items: ["Kafka", "RabbitMQ", "Pub/Sub", "SQS"],
  },
  {
    title: "Tools",
    items: ["Git", "Jira", "Figma", "Postman", "Expo"],
  },
];

export const degrees: Degree[] = [
  {
    degree: "Master of Information Technology (Artificial Intelligence)",
    school: "University of Melbourne",
  },
  {
    degree: "Bachelor of Engineering (Electrical Engineering)",
    school: "University of Queensland",
  },
];
