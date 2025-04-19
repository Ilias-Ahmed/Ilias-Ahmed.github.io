import { Skill } from "./types";

/**
 * Collection of skills with their detailed information
 */
export const skills: Skill[] = [
  {
    id: "react",
    name: "React",
    level: 90,
    category: "Frontend",
    icon: "⚛️",
    color: "#61dafb",
    description:
      "Building complex UIs with React hooks, context, and modern patterns",
    projects: 24,
    yearsExperience: 4,
  },
  {
    id: "typescript",
    name: "TypeScript",
    level: 85,
    category: "Frontend",
    icon: "TS",
    color: "#3178c6",
    description: "Type-safe development with advanced TypeScript features",
    projects: 20,
    yearsExperience: 3,
  },
  {
    id: "nodejs",
    name: "Node.js",
    level: 80,
    category: "Backend",
    icon: "🟢",
    color: "#68a063",
    description: "Server-side JavaScript with Express, APIs, and microservices",
    projects: 18,
    yearsExperience: 3,
  },
  {
    id: "mongodb",
    name: "MongoDB",
    level: 75,
    category: "Backend",
    icon: "🍃",
    color: "#13aa52",
    description:
      "NoSQL database design, aggregation pipelines, and optimization",
    projects: 15,
    yearsExperience: 2,
  },
  {
    id: "graphql",
    name: "GraphQL",
    level: 70,
    category: "Backend",
    icon: "◯",
    color: "#e535ab",
    description:
      "Schema design, resolvers, and Apollo Server/Client implementation",
    projects: 10,
    yearsExperience: 2,
  },
  {
    id: "threejs",
    name: "Three.js",
    level: 65,
    category: "Frontend",
    icon: "🔺",
    color: "#000000",
    description: "3D graphics and animations for web applications",
    projects: 8,
    yearsExperience: 1,
  },
  {
    id: "docker",
    name: "Docker",
    level: 75,
    category: "DevOps",
    icon: "🐳",
    color: "#2496ed",
    description: "Containerization, Docker Compose, and deployment strategies",
    projects: 14,
    yearsExperience: 2,
  },
  {
    id: "tailwind",
    name: "Tailwind CSS/CSS",
    level: 85,
    category: "Frontend",
    icon: "🎨",
    color: "#264de4",
    description: "Responsive design, animations, and modern CSS techniques",
    projects: 22,
    yearsExperience: 4,
  },
  {
    id: "git",
    name: "Git",
    level: 90,
    category: "DevOps",
    icon: "📦",
    color: "#f05032",
    description:
      "Version control, branching strategies, and collaborative workflows",
    projects: 30,
    yearsExperience: 5,
  },
  {
    id: "webgl",
    name: "WebGL",
    level: 60,
    category: "Frontend",
    icon: "🧊",
    color: "#990000",
    description: "Low-level graphics programming for web applications",
    projects: 5,
    yearsExperience: 1,
  },
];

/**
 * Unique categories extracted from skills
 */
export const categories = Array.from(
  new Set(skills.map((skill) => skill.category))
);
