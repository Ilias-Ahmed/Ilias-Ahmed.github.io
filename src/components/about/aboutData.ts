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
    year: "2023",
    title: "Senior Full-Stack Developer",
    company: "Tech Innovations Inc.",
    description:
      "Leading development of next-generation applications using React, Node.js and cloud technologies.",
    achievements: [
      "Architected microservices infrastructure",
      "Reduced API response time by 40%",
      "Led team of 5 developers",
      "Implemented CI/CD pipelines",
    ],
    technologies: ["React", "Express", "MongoDB", "Redux", "AWS"],
  },
  {
    year: "2018",
    title: "Frontend Developer",
    company: "Creative Agency",
    description:
      "Worked on multiple client projects focusing on responsive design and interactivity.",
    achievements: [
      "Created interactive web experiences",
      "Implemented animations with GSAP",
      "Optimized website performance",
      "Developed mobile-first designs",
    ],
    technologies: ["JavaScript", "HTML/CSS", "GSAP", "jQuery", "Sass"],
  },
  {
    year: "2016",
    title: "Junior Developer",
    company: "Startup Nexus",
    description:
      "Started career journey building websites and learning modern development practices.",
    achievements: [
      "Built company website",
      "Learned front-end frameworks",
      "Contributed to open source",
      "Developed WordPress themes",
    ],
    technologies: ["HTML/CSS", "JavaScript", "Bootstrap", "PHP", "WordPress"],
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
    title: "Google Cloud Professional Developer",
    issuer: "Google",
    date: "2021",
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2669&auto=format&fit=crop",
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
      "My primary UI library for building component-based interfaces with a declarative approach. I've used React for everything from small websites to large enterprise applications.",
  },
  {
    name: "TypeScript",
    icon: "TS",
    category: "Frontend",
    description:
      "I use TypeScript to add static typing to JavaScript, improving code quality, catching errors early, and enhancing developer experience with better tooling.",
  },
  {
    name: "Node.js",
    icon: "🟢",
    category: "Backend",
    description:
      "My go-to JavaScript runtime for building scalable server-side applications and APIs. I've built everything from RESTful services to real-time applications.",
  },
  {
    name: "Express",
    icon: "🚂",
    category: "Backend",
    description:
      "A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.",
  },
  {
    name: "MongoDB",
    icon: "🍃",
    category: "Database",
    description:
      "My preferred NoSQL database for building flexible, scalable applications with JSON-like documents and dynamic schemas.",
  },
  {
    name: "GraphQL",
    icon: "◯",
    category: "API",
    description:
      "I use GraphQL to build efficient APIs by enabling clients to request exactly what they need, making it easier to evolve APIs over time.",
  },
  {
    name: "Docker",
    icon: "🐳",
    category: "DevOps",
    description:
      "I containerize applications to ensure consistency across development, testing, and production environments, simplifying deployment and scaling.",
  },
  {
    name: "AWS",
    icon: "☁️",
    category: "Cloud",
    description:
      "I leverage AWS services to build scalable, reliable cloud infrastructure for applications, including EC2, S3, Lambda, and more.",
  },
  {
    name: "Three.js",
    icon: "🔺",
    category: "Graphics",
    description:
      "I use Three.js to create immersive 3D experiences and visualizations in the browser, adding depth and interactivity to web applications.",
  },
  {
    name: "Next.js",
    icon: "N",
    category: "Frontend",
    description:
      "My preferred React framework for building production-ready applications with server-side rendering, static site generation, and more.",
  },
  {
    name: "TailwindCSS",
    icon: "🌊",
    category: "Frontend",
    description:
      "A utility-first CSS framework I use to rapidly build custom user interfaces without leaving HTML, enabling consistent design systems.",
  },
  {
    name: "PostgreSQL",
    icon: "🐘",
    category: "Database",
    description:
      "My go-to relational database for applications requiring complex queries, transactions, and data integrity constraints.",
  },
  {
    name: "Redis",
    icon: "🔴",
    category: "Database",
    description:
      "I use Redis as an in-memory data structure store for caching, real-time analytics, and high-performance data operations.",
  },
  {
    name: "GitHub Actions",
    icon: "🔄",
    category: "DevOps",
    description:
      "My preferred CI/CD tool for automating workflows, testing, and deployment pipelines directly from GitHub repositories.",
  },
  {
    name: "Framer Motion",
    icon: "🎭",
    category: "Frontend",
    description:
      "A production-ready motion library for React that I use to create fluid animations and interactive UI elements.",
  },
];
