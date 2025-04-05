export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github?: string;
  featured?: boolean;
  color?: string;
}

export interface StatItem {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export type ViewMode = "showcase" | "grid" | "timeline";
