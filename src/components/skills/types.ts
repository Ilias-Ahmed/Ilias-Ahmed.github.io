/**
 * Represents a technical skill with its properties
 */
export interface Skill {
  id: string;
  name: string;
  level: number; // Proficiency level (0-100)
  category: string;
  icon: string;
  color: string;
  description: string;
  projects: number;
  yearsExperience: number;
}

/**
 * Available view modes for skills display
 */
export type ViewMode = "grid" | "mastery" | "comparison";

/**
 * Represents a mastery level grouping for skills
 */
export interface MasteryLevel {
  name: string;
  range: [number, number]; // Min and max proficiency values
  skills: Skill[];
}

/**
 * Data structure for skill distribution visualization
 */
export interface DistributionData {
  name: string;
  value: number;
  color: string;
}
