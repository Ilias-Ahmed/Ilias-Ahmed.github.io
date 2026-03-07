export interface TimelineData {
  year: string;
  title: string;
  company: string;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface TechStackItem {
  name: string;
  icon: string;
  category: string;
  description: string;
}

export interface CertificationItem {
  title: string;
  issuer: string;
  date: string;
  image: string;
}

export const timelineData: TimelineData[] = [
  {
    year: "2022",
    title: "Junior Developer",
    company: "NA",
    description:
      "Started my development journey by building and maintaining websites while learning modern best practices.",
    achievements: [
      "Built company’s main website from scratch",
      "Explored frontend libraries and frameworks",
      "Contributed to open-source communities",
      "Developed and customized WordPress themes",
    ],
    technologies: ["HTML", "CSS", "JavaScript"],
  },
  {
    year: "2024",
    title: "Frontend Developer",
    company: "Creative Agency",
    description:
      "Focused on delivering rich, interactive UI/UX for clients across various industries.",
    achievements: [
      "Created immersive user interfaces with GSAP animations",
      "Optimized website performance and load times",
      "Built fully responsive, mobile-first designs",
      "Collaborated with cross-functional teams to deliver projects",
    ],
    technologies: ["JavaScript", "REACT", "GSAP", "motion", "Tailwind CSS"],
  },
  {
    year: "2025",
    title: "Senior Full-Stack Developer",
    company: "Tech Innovations Inc.",
    description:
      "Leading the development of modern web applications using React, Node.js, and AWS cloud solutions.",
    achievements: [
      "Architected microservices infrastructure for scalable deployments",
      "Reduced API latency by 40% through performance optimization",
      "Mentored and led a team of 5 developers",
      "Implemented CI/CD workflows for automated delivery",
    ],
    technologies: ["NODE", "Express", "MongoDB", "Redux", "AWS"],
  },
];


export const certifications: CertificationItem[] = [
  {
    title: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    date: "2022",
    image:
      "https://images.unsplash.com/photo-1565106430482-8f6e74349ca1?q=80&w=2670&auto=format&fit=crop",
  },
  {
    title: "React Advanced Concepts",
    issuer: "Frontend Masters",
    date: "2020",
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2670&auto=format&fit=crop",
  },
  {
    title: "TypeScript Professional",
    issuer: "Udemy",
    date: "2019",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2670&auto=format&fit=crop",
  },
];


export const techStack: TechStackItem[] = [
  {
    name: "React",
    icon: "⚛️",
    category: "Frontend",
    description:
      "Primary UI library for building fast, dynamic, and component-driven interfaces.",
  },
  {
    name: "TypeScript",
    icon: "TS",
    category: "Frontend",
    description:
      "Typed superset of JavaScript that helps reduce bugs and enhance code readability and scalability.",
  },
  {
    name: "Node.js",
    icon: "🟢",
    category: "Backend",
    description:
      "JavaScript runtime used to build fast, scalable backend services and REST APIs.",
  },
  {
    name: "Express",
    icon: "🚂",
    category: "Backend",
    description:
      "Minimal Node.js web framework for creating robust backend routes and APIs.",
  },
  {
    name: "MongoDB",
    icon: "🍃",
    category: "Database",
    description:
      "NoSQL database used for flexible and scalable data storage with dynamic schemas.",
  },
  {
    name: "GraphQL",
    icon: "◯",
    category: "API",
    description:
      "API query language that lets clients request only the data they need, improving efficiency.",
  },
  {
    name: "Docker",
    icon: "🐳",
    category: "DevOps",
    description:
      "Containerization tool to ensure consistent development and deployment environments.",
  },
  {
    name: "AWS",
    icon: "☁️",
    category: "Cloud",
    description:
      "Cloud platform used to deploy and scale applications using services like EC2, Lambda, and S3.",
  },
  {
    name: "Three.js",
    icon: "🔺",
    category: "Graphics",
    description:
      "Powerful library for creating interactive 3D experiences directly in the browser.",
  },
  {
    name: "Next.js",
    icon: "N",
    category: "Frontend",
    description:
      "Production-grade React framework supporting SSR, SSG, API routes, and hybrid rendering.",
  },
  {
    name: "TailwindCSS",
    icon: "🌊",
    category: "Frontend",
    description:
      "Utility-first CSS framework used to rapidly build modern, responsive UIs with ease.",
  },
  {
    name: "PostgreSQL",
    icon: "🐘",
    category: "Database",
    description:
      "Open-source SQL database known for reliability, advanced querying, and transaction support.",
  },
  {
    name: "Redis",
    icon: "🔴",
    category: "Database",
    description:
      "In-memory database used for caching, pub/sub, and managing real-time data operations.",
  },
  {
    name: "GitHub Actions",
    icon: "🔄",
    category: "DevOps",
    description:
      "Automation tool for CI/CD directly in GitHub, managing tests, builds, and deployments.",
  },
  {
    name: "Framer Motion",
    icon: "🎭",
    category: "Frontend",
    description:
      "Advanced animation library for React, used to create fluid transitions and dynamic UIs.",
  },
];

