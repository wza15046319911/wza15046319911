import React from "react";
import { Code, Layout, User, Briefcase, Mail, ExternalLink } from "lucide-react";
import { SiInstagram, SiGithub } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa6";

export const navItems = [
  { name: "About", link: "#about", icon: <User className="h-4 w-4" /> },
  { name: "Skills", link: "#skills", icon: <Code className="h-4 w-4" /> },
  { name: "Projects", link: "#projects", icon: <Layout className="h-4 w-4" /> },
  { name: "Experience", link: "#experience", icon: <Briefcase className="h-4 w-4" /> },
  { name: "Contact", link: "#contact", icon: <Mail className="h-4 w-4" /> },
  { name: "Resume", link: "/resume.pdf", icon: <ExternalLink className="h-4 w-4" /> },
];

export const heroData = {
  name: "Zian Wang",
  subtitle: "Full Stack Developer",
  location: "Melbourne, Australia",
  description: "I build accessible, pixel-perfect, performant, and awesome web applications.",
  cta: "See my work",
  status: "Available for new opportunities",
};

export const aboutData = {
  title: "About Me",
  description:
    "I am a results-driven full-stack software engineer with over five years of experience building and delivering scalable, high-performance applications across both frontend and backend systems. I specialise in Python, React, Node.js, TypeScript, PostgreSQL, MongoDB, CI/CD automation, Docker, Kubernetes, and automated testing, and I have designed and deployed production systems used by thousands of users. I work effectively in Agile environments, collaborating closely with cross-functional teams to ship reliable, well-architected solutions on time.",
  stats: [
    { label: "Years of Experience", value: 5, suffix: "+" },
    { label: "Companies Worked With", value: 5, suffix: "" },
    { label: "Featured Projects", value: 4, suffix: "" },
  ],
};

export const skillsData = {
  frontend: [
    "React.js",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "Redux",
    "Framer Motion",
    "Radix UI",
  ],
  backend: ["Node.js", "Express.js", "Python", "PostgreSQL", "MongoDB", "Drizzle ORM"],
  tools: ["Docker", "Kubernetes", "CI/CD", "GitHub Actions", "AWS", "GCP", "Git", "Postman"],
};

export type Project = {
  id: number;
  title: string;
  description: string;
  img: string;
  link: string;
  github: string;
  tech: string[];
  wechatInfo?: string;
};

export const projectsData: Project[] = [
  {
    id: 4,
    title: "UQ Ask Anything",
    description:
      "A retrieval-augmented QA service answering UQ students' questions on courses, prerequisites, fees, and policy over Postgres + pgvector. An LLM planner routes each question to structured, semantic, or hybrid retrieval, while high-risk enrolment facts are answered by deterministic code for zero hallucination.",
    img: "/uq-ask-anything.png",
    link: "https://uqaskanything.lewiswang.com.au/",
    github: "https://github.com/wza15046319911/uqaskanything",
    tech: [
      "Python",
      "PostgreSQL",
      "pgvector",
      "RAG",
      "bge-m3",
      "RRF Hybrid Retrieval",
      "Ollama",
      "DeepSeek",
      "AWS Bedrock",
    ],
  },
  {
    id: 1,
    title: "Piggyway",
    description:
      "A modern e-commerce platform for small pet care, built with Next.js 16 and Hono/Bun. Features secure Stripe payments and real-time inventory tracking.",
    img: "/piggyway.png",
    link: "https://piggyway.com.au",
    github: "https://github.com/piggyway/piggy-frontend",
    tech: [
      "Next.js 16",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Radix UI",
      "Framer Motion",
      "NextAuth.js",
      "Hono",
      "Bun",
      "PostgreSQL",
      "Drizzle ORM",
      "Directus",
      "Zod",
      "Stripe",
    ],
  },
  {
    id: 2,
    title: "Nothing But Fun",
    description:
      "A community lifestyle WeChat Mini Program built with Taro and Node.js. Features event registration, secondhand trading, and rental services.",
    img: "https://res.cloudinary.com/davy7cgyi/image/upload/v1768392592/427shots_so_sz1apq.png",
    link: "",
    wechatInfo: "微信搜索布好玩bris小程序",
    github: "https://github.com/wza15046319911/nothing-but-fun",
    tech: [
      "Taro",
      "React",
      "TypeScript",
      "NutUI",
      "Tailwind CSS",
      "Node.js",
      "Express",
      "PostgreSQL",
      "Drizzle ORM",
      "Cloudinary",
      "Directus",
      "Railway",
    ],
  },
  {
    id: 3,
    title: "StudyPilot",
    description:
      "An adaptive learning platform for exam preparation built with Next.js 15 and Supabase. Features timed mock exams and intelligent mistake-review system.",
    img: "/study-pilot.png",
    link: "https://studypilot.lewiswang.com.au",
    github: "https://github.com/wza15046319911/study-pilot",
    tech: [
      "Next.js 15",
      "React 19",
      "TypeScript",
      "Tailwind CSS",
      "Radix UI",
      "Framer Motion",
      "Aceternity UI",
      "Supabase",
      "PostgreSQL",
      "Row Level Security",
      "Stripe",
      "Vercel",
    ],
  },
];

export type ExperienceItem = {
  title: string;
  company: string;
  period: string;
  summary: string;
  technologies: string;
  bullets: string[];
};

export const experienceData: {
  title: string;
  description: string;
  items: ExperienceItem[];
} = {
  title: "Experience",
  description:
    "My journey as a Full Stack Developer, building scalable applications and leading technical teams.",
  items: [
    {
      title: "Full Stack Developer",
      company: "Broadsheet",
      period: "Feb 2025 – Jul 2026",
      summary:
        "Architected and shipped responsive, scalable web applications for a major media platform with Next.js, TypeScript, and Node.js, backed by an event-driven backend on GCP. Pioneered AI-augmented development across the team workflow.",
      technologies:
        "Next.js, React.js, TypeScript, Node.js, Python, PostgreSQL, Redis, GCP, Docker, Kubernetes, CI/CD, Jest",
      bullets: [
        "Architected and shipped responsive, scalable web applications with Next.js, TypeScript, and Node.js, integrating RESTful APIs and Redis caching for measurable performance and reliability gains",
        "Designed an event-driven backend on GCP (Cloud Run, GKE, Pub/Sub) with a message-queue event-bus and PostgreSQL schema design for high availability and horizontal scalability",
        "Owned the full delivery pipeline with containerised CI/CD on Docker and Kubernetes plus Jest/Python test coverage across microservices",
        "Pioneered AI-augmented development by integrating Claude Code, Codex, and Cursor into the team workflow to accelerate delivery without compromising code quality",
        "Drove engineering standards through code review and cross-functional Agile collaboration",
      ],
    },
    {
      title: "Full Stack Developer",
      company: "AnyStay",
      period: "Dec 2023 – Dec 2024",
      summary:
        "Delivered an innovative e-commerce platform for short- and long-term stays, covering host and guest systems, sales, and membership management, with React.js, GraphQL, Node.js, and AWS.",
      technologies:
        "React.js, Redux, Node.js, Python, GraphQL, DynamoDB, AWS, CI/CD, Jest, Selenium",
      bullets: [
        "Built responsive web applications with React.js (Redux) and GraphQL, backed by RESTful APIs in Node.js",
        "Designed DynamoDB table structures and access patterns, optimising partition/sort keys and indexes for high-throughput, low-latency workloads at scale",
        "Architected an event-driven service bus on a message queue and shipped via CI/CD to AWS Amplify (frontend) and Lambda (backend)",
        "Drove quality through Jest unit tests, Python Selenium automation, and comprehensive code reviews",
        "Led projects in a fast-paced Agile environment, partnering with UX/UI and cross-functional teams to meet deadlines",
      ],
    },
    {
      title: "Full Stack Developer",
      company: "ByteDance",
      period: "Jul 2023 – Dec 2023",
      summary:
        "Built full-stack web middleware and platform services at enterprise scale, focusing on performance, event-driven architecture, and containerised delivery.",
      technologies:
        "React.js, TypeScript, Node.js, Express.js, Python, PostgreSQL, Redis, Kafka, Docker, Kubernetes, Terraform, CI/CD, Jest",
      bullets: [
        "Built full-stack web middleware with React.js, TypeScript, and Node.js (Express.js) over PostgreSQL, designing schemas and tuning indexes/queries for reliable performance",
        "Implemented a Redis-backed queue system that cut middleware latency by 60%, and introduced event-driven architecture via message queue to decouple core services",
        "Containerised middleware and API services with Docker and orchestrated deployments on Kubernetes for consistent runtime across environments",
        "Built and maintained CI/CD pipelines for frontend and backend, with Terraform managing infrastructure as code",
        "Safeguarded quality through automated API and unit tests (Python, Jest) in a fast-paced Agile environment",
      ],
    },
    {
      title: "Full Stack Developer",
      company: "Kexing EasyGo",
      period: "Jan 2022 – Jul 2023",
      summary:
        "Built mobile applications for University of Queensland students, consolidating grades, deadlines, schedules, and course evaluations into one platform with React Native, Node.js, and a Kafka event-bus. Led a small frontend and backend team.",
      technologies:
        "React.js, React Native, TypeScript, Tailwind CSS, Redux, Node.js, PostgreSQL, MongoDB, Kafka, AWS, Docker, Kubernetes, Terraform, CI/CD, Jest, Selenium, Postman",
      bullets: [
        "Built full-stack applications with React.js, Tailwind CSS, TypeScript, and Redux, backed by RESTful APIs in Node.js/TypeScript",
        "Architected a Kafka-based event-bus for pub/sub messaging across microservices, enabling durable event processing and reducing coupling",
        "Containerised services with Docker and orchestrated them on Kubernetes (AWS) for reliable horizontal scaling, with CI/CD and Terraform-provisioned infrastructure",
        "Established a Jest unit-testing standard across frontend and backend, integrated into CI with enforced coverage thresholds",
        "Led a team of frontend and backend developers, driving code reviews and providing technical support",
      ],
    },
    {
      title: "Full Stack Developer",
      company: "Graviti",
      period: "Jan 2021 – Jan 2022",
      summary:
        "Worked on next-generation AI data tooling for efficient dataset acquisition, storage, and processing, building a React dashboard and a distributed Python web-crawling system.",
      technologies:
        "React.js, TypeScript, Python, Golang, MongoDB, RabbitMQ, Docker, Kubernetes, CI/CD, Jest",
      bullets: [
        "Designed and built a React.js/TypeScript dashboard alongside a distributed web-crawling system in Python, with a custom API Gateway and RESTful APIs in Golang",
        "Architected MongoDB document schemas with indexing strategies for crawled datasets, supporting efficient querying across large volumes of unstructured data",
        "Built an asynchronous RabbitMQ job queue to coordinate distributed crawlers and downstream processing",
        "Packaged services with Docker and deployed on Kubernetes for elastic scaling of crawler workers, with unit tests integrated into CI",
        "Delivered within 2-week Agile sprints, partnering with UX/UI designers, product managers, and cross-functional teams",
      ],
    },
  ],
};

export const contactData = {
  email: "zianwang9911@gmail.com",
  social: [
    {
      title: "GitHub",
      icon: <SiGithub className="h-full w-full text-neutral-300" />,
      href: "https://github.com/wza15046319911",
    },
    {
      title: "LinkedIn",
      icon: <FaLinkedin className="h-full w-full text-neutral-300" />,
      href: "https://www.linkedin.com/in/zian-wang-39081b225/",
    },
    {
      title: "Instagram",
      icon: <SiInstagram className="h-full w-full text-neutral-300" />,
      href: "https://www.instagram.com/zianwangw?igsh=MTduNXk1ZnNmOHdwZA%3D%3D&utm_source=qr",
    },
    {
      title: "Email",
      icon: <Mail className="h-full w-full text-neutral-300" />,
      href: "mailto:zianwang9911@gmail.com",
    },
  ],
};
