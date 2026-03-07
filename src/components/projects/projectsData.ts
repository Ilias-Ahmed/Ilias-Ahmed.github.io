import { Project } from "./types";

export const projectsData: Project[] = [
  {
    id: "1",
    title: "MIPedia - Personal Service Platform",
    description:
      "MIPedia is your one-stop personal platform providing developer tips, coding resources, and career support.",
    longDescription:
      "MIPedia is a personal service-based startup aimed at helping beginner to advanced developers with curated coding resources, career preparation tools, and project showcases. It's a growing hub for students and software engineers.",
    image: "/images/mipedia.png",
    tags: ["Next.js", "Notion API", "Vercel", "Personal"],
    technologies: [
      "Next.js",
      "Notion API",
      "Vercel",
      "Tailwind CSS",
      "TypeScript",
      "Supabase",
    ],
    link: "https://mipedia.tech",
    github: "https://github.com/Ilias-Ahmed/MIPedia",
    category: "Startup",
    year: "2025",
    status: "in-progress",
    features: [
      "Daily coding tips and articles",
      "Personal Notion integration",
      "Free resources and tools",
      "Developer-focused UI",
      "Custom roadmap builder",
    ],
    challenges: [
      "Managing content dynamically via Notion API",
      "Building SEO-optimized personal platform",
    ],
    featured: true,
  },
  {
    id: "2",
    title: "ChatNest - Realtime Chat App",
    description:
      "A lightweight and secure real-time chat application built with Socket.IO and modern UI features.",
    longDescription:
      "ChatNest is a real-time chat application enabling users to connect instantly with one-on-one and group messaging, online presence status, and message notifications. Built with a focus on simplicity, performance, and clean user experience.",
    image:
      "https://images.unsplash.com/photo-1525186402429-b4ff38bedec6?w=800&h=600&fit=crop",
    tags: ["Next.js", "Socket.IO", "Tailwind CSS"],
    technologies: [
      "Next.js",
      "TypeScript",
      "Socket.IO",
      "Node.js",
      "Zustand",
      "Tailwind CSS",
      "Framer Motion",
    ],
    link: "https://chatnest.live",
    github: "https://github.com/Ilias-Ahmed/ChatNest",
    category: "Communication",
    year: "2025",
    status: "completed",
    features: [
      "Real-time messaging (Socket.IO)",
      "Group and private chats",
      "User online status",
      "Typing indicators and read receipts",
      "Smooth, responsive UI with animation",
    ],
    challenges: [
      "Handling WebSocket connections at scale",
      "Maintaining chat state across sessions",
      "UX for chat threading and scroll behavior",
    ],
    results: [
      "Seamless chat experience with <100ms latency",
      "Deployed to 200+ users in testing phase",
    ],
    featured: true,
  },
  {
    id: "3",
    title: "EduTrack - Learning Management System",
    description:
      "An educational platform for institutes to manage courses, track progress, and facilitate real-time learning.",
    longDescription:
      "EduTrack is a complete LMS built for institutions, enabling course delivery, real-time collaboration, and personalized learning paths. Features include video lectures, assessments, student progress tracking, live chat, and admin dashboards.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
    tags: ["React", "Node.js", "Socket.IO", "MongoDB"],
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.IO",
      "FFmpeg",
      "WebRTC",
      "AWS S3",
    ],
    link: "https://edutrack.mipedia.tech",
    github: "https://github.com/Ilias-Ahmed/EduTrack",
    category: "Education",
    year: "2024",
    status: "completed",
    features: [
      "Interactive video lectures",
      "Course progress tracking",
      "Live chat and collaboration tools",
      "Admin dashboard and analytics",
      "Responsive UI for students and teachers",
    ],
    challenges: [
      "Video streaming at scale",
      "Building adaptive learning paths",
      "Real-time sync for class interactions",
    ],
    results: [
      "Successfully used by 3 institutions",
      "Improved student engagement by 40%",
    ],
    featured: true,
  },
  {
    id: "4",
    title: "Blog Post Site",
    description:
      "A personal blogging platform with markdown editor, custom themes, and SEO optimization.",
    longDescription:
      "This blog site supports markdown writing, custom themes, tags, and categories for organizing posts. Built with a fast-rendering frontend, server-side rendering, and responsive design. Ideal for personal or educational content.",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800&h=600&fit=crop",
    tags: ["Next.js", "Markdown", "Tailwind CSS"],
    technologies: ["Next.js", "MDX", "Tailwind CSS", "TypeScript", "Vercel"],
    link: "https://blog.iliasahmed.dev",
    github: "https://github.com/Ilias-Ahmed/Blog-Platform",
    category: "Blog",
    year: "2024",
    status: "completed",
    features: [
      "Live markdown preview editor",
      "SEO and open graph optimization",
      "Blog categories and tags",
      "Mobile responsive UI",
    ],
    challenges: [
      "Markdown rendering and sanitization",
      "Dynamic routing for SEO-friendly URLs",
    ],
    results: [
      "Deployed with <1s load time",
      "Indexed and ranked by search engines",
    ],
    featured: true,
  },
  {
    id: "5",
    title: "NodeNest - Social Media Web App",
    description:
      "A full-featured social media platform with real-time chat, post interactions, and user profile customization.",
    longDescription:
      "NodeNest is a scalable social media web application developed using the MERN stack. It includes real-time messaging (Socket.IO), authentication (JWT), post creation, likes, comments, and profile customization. Optimized for performance and scalability with a modern UI using Tailwind CSS and animations with Framer Motion.",
    image:
      "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&h=600&fit=crop",
    tags: ["MERN", "Socket.IO", "JWT", "Tailwind CSS"],
    technologies: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "Socket.IO",
      "JWT",
      "Cloudinary",
      "Tailwind CSS",
      "Zod",
      "React Hook Form",
      "Framer Motion",
      "Vite",
    ],
    link: "https://nodenest.live",
    github: "https://github.com/Ilias-Ahmed/NodeNest",
    category: "Social Media",
    year: "2025",
    status: "completed",
    features: [
      "Real-time chat system",
      "JWT-based secure login",
      "Post creation, comments, likes",
      "Profile photo uploads via Cloudinary",
      "Responsive UI and smooth animations",
    ],
    challenges: [
      "Real-time messaging implementation",
      "State management for complex UI",
      "Secure image and post handling",
    ],
    results: [
      "100% real-time communication",
      "Production-ready deployment",
      "Positive user feedback",
    ],
    featured: true,
  },
];
