import React from "react";
import { Code, Layout, User, Briefcase, Mail, ExternalLink } from "lucide-react";
import { SiInstagram, SiGithub, SiLinkedin } from "react-icons/si";

export const navItems = [
  { name: "About", link: "#about", icon: <User className="h-4 w-4" /> },
  { name: "Skills", link: "#skills", icon: <Code className="h-4 w-4" /> },
  { name: "Projects", link: "#projects", icon: <Layout className="h-4 w-4" /> },
  { name: "Experience", link: "#experience", icon: <Briefcase className="h-4 w-4" /> },
  { name: "Contact", link: "#contact", icon: <Mail className="h-4 w-4" /> },
  { name: "Resume", link: "/resume.pdf", icon: <ExternalLink className="h-4 w-4" /> },
];

export const heroData = {
  title: "Creating Digital Experiences with Passion",
  subtitle: "Senior Full Stack Developer",
  description: "I build accessible, pixel-perfect, performant, and awesome web applications.",
  cta: "See my work",
};

export const aboutData = {
  title: "About Me",
  description:
    "I am a results-driven full-stack software engineer with over five years of experience building and delivering scalable, high-performance applications across both frontend and backend systems. I specialise in Python, React, Node.js, TypeScript, PostgreSQL, MongoDB, CI/CD automation, Docker, Kubernetes, and automated testing, and I have designed and deployed production systems used by thousands of users. I work effectively in Agile environments, collaborating closely with cross-functional teams to ship reliable, well-architected solutions on time.",
  stats: [
    { label: "Years of Experience", value: 5 },
    { label: "Projects Completed", value: 50 },
    { label: "Happy Clients", value: 30 },
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

export const projectsData = [
  {
    id: 1,
    title: "Piggyway",
    description:
      "A modern e-commerce platform for small pet care, built with Next.js 16 and Hono/Bun. Features secure Stripe payments and real-time inventory tracking.",
    img: "https://res.cloudinary.com/davy7cgyi/image/upload/v1767875655/og_image_yjdd1w.png",
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
    img: "",
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
    img: "https://res.cloudinary.com/davy7cgyi/image/upload/v1768304297/studypilot-screenshot_cwtgql.png",
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

export const experienceData = {
  title: "Experience",
  description:
    "My journey as a Full Stack Developer, building scalable applications and leading technical teams.",
  items: [
    {
      title: "Senior Full Stack Developer",
      company: "Broadsheet Media",
      period: "Feb 2025 – Present",
      description:
        "Owned the design and delivery of scalable, high-traffic web and API systems supporting a major media platform, using Next.js, Node.js, TypeScript, and PostgreSQL. Drove performance, reliability, and deployment maturity through event-driven architecture, cloud-native tooling, and strong engineering governance in an Agile environment.\nTechnologies: Next.js, Node.js, TypeScript, PostgreSQL, GCP, CI/CD\n• Led development of scalable frontend and backend systems serving large daily user traffic\n• Designed event-based services and caching strategies to improve system performance and resilience\n• Established and maintained CI/CD pipelines and containerised deployments on GCP\n• Championed code quality through reviews, testing standards, and cross-team collaboration",
    },
    {
      title: "Senior Full Stack Developer",
      company: "AnyStay",
      period: "Dec 2023 – Apr 2024",
      description:
        "Delivered core features for a multi-sided accommodation marketplace, spanning React frontends, Node.js services, and AWS infrastructure. Played a key role in technical execution, sprint delivery, and system reliability within a fast-moving product team.\nTechnologies: React, Redux, GraphQL, Node.js, AWS, CI/CD\n• Built and maintained customer-facing web applications using React, Redux, and GraphQL\n• Designed and implemented backend APIs and serverless services on AWS\n• Owned CI/CD workflows for frontend and backend deployments across environments\n• Improved quality and stability through automated testing and structured code reviews",
    },
    {
      title: "Full Stack Developer",
      company: "ByteDance",
      period: "Jul 2023 – Dec 2023",
      description:
        "Contributed to internal middleware and platform systems at enterprise scale, supporting high-throughput data and content workflows. Focused on performance optimisation, test-driven development, and production-grade engineering practices.\nTechnologies: Next.js, Node.js, PostgreSQL, Redis, TDD\n• Developed middleware and APIs using Next.js, Node.js, PostgreSQL, and Redis\n• Reduced service latency by ~60% through queue-based processing and caching strategies\n• Applied TDD and implemented automated API and integration tests\n• Actively participated in design discussions, code reviews, and sprint delivery",
    },
    {
      title: "Lead Full Stack Developer",
      company: "Kexing EasyGo",
      period: "Nov 2020 – Nov 2022",
      description:
        "Led end-to-end development of a mobile platform serving university students, integrating academic planning and management features. Provided technical leadership across architecture, delivery, and team execution in an Agile environment.\nTechnologies: React, React Native, Node.js, RESTful API, CI/CD\n• Led a cross-functional engineering team across frontend, backend, and mobile development\n• Designed scalable RESTful APIs and mobile-first interfaces using React and React Native\n• Established CI/CD pipelines and automated testing to support continuous delivery\n• Partnered with product and design to align technical decisions with user experience goals",
    },
    {
      title: "Full Stack Developer",
      company: "Graviti",
      period: "Jan 2021 – Jan 2022",
      description:
        "Worked on AI tooling and data infrastructure products, enabling efficient dataset processing and visualisation. Contributed to scalable system design across distributed services, APIs, and user-facing dashboards.\nTechnologies: Python, Golang, MongoDB, React, CI/CD\n• Built distributed crawling systems and backend services using Python and Golang\n• Designed and developed React-based dashboards for internal and external users\n• Implemented CI/CD pipelines and deployment automation for cloud environments\n• Improved system robustness through architectural reviews and performance tuning",
    },
    {
      title: "Full Stack Developer",
      company: "HD EDU",
      period: "Nov 2018 – Nov 2020",
      description:
        "Developed and maintained education platforms supporting international university students across multiple regions. Built a strong foundation in full-stack engineering, automation, and Agile delivery.\nTechnologies: React, Node.js, Python, MongoDB, CI/CD\n• Developed frontend applications and backend APIs using React, Node.js, and Python\n• Automated large-scale data collection through custom Python scraping pipelines\n• Improved maintainability through refactoring, testing, and coding standards\n• Collaborated closely with product and design teams to deliver user-centric solutions",
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
      icon: <SiLinkedin className="h-full w-full text-neutral-300" />,
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
