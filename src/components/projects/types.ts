export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  image: string;
  tags: string[];
  link: string;
  github?: string;
  featured?: boolean;
  color?: string;
  category?: string;
  year?: string;
  status?: "completed" | "in-progress" | "planned";
  technologies?: string[];
  features?: string[];
  challenges?: string[];
  results?: string[];
}

export interface StatItem {
  value: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  color?: string;
}

export type ViewMode = "showcase" | "grid" | "timeline";

export interface ProjectFilter {
  category?: string;
  technology?: string;
  status?: string;
  year?: string;
}

export interface ProjectCardProps {
  project: Project;
  index: number;
  featured?: boolean;
  variant?: "default" | "compact" | "detailed";
}

export interface ProjectGridProps {
  projects: Project[];
  filter?: ProjectFilter;
  columns?: 1 | 2 | 3 | 4;
}

export interface ProjectTimelineProps {
  projects: Project[];
  sortBy?: "year" | "title" | "category";
}

export interface ProjectShowcaseProps {
  projects: Project[];
  autoplay?: boolean;
  showNavigation?: boolean;
}

export interface ProjectViewToggleProps {
  activeView: ViewMode;
  onChange: (view: ViewMode) => void;
}
