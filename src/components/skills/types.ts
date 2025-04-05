
export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  icon: string;
  color: string;
  description: string;
  projects: number;
  yearsExperience: number;
}

export type ViewMode = "grid" | "mastery" | "comparison";

export interface MasteryLevel {
  name: string;
  range: [number, number];
  skills: Skill[];
}

export interface DistributionData {
  name: string;
  value: number;
  color: string;
}
