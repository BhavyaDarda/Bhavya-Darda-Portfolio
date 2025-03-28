export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface Experience {
  id: number;
  role: string;
  period: string;
  description: string;
  skills: string[];
  alignment: 'left' | 'right';
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  year: string;
  icon: string;
}

export interface Skill {
  category: string;
  icon: string;
  items: string[];
}

export interface ThemeOption {
  name: string;
  color: string;
  id: string;
}

export type ThemeId = 'gold' | 'emerald' | 'platinum';
