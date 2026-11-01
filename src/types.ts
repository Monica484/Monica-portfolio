export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  bullets: string[];
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  featured: boolean;
  metrics?: { label: string; value: string }[];
}

export interface ExperienceItem {
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  highlights: string[];
  skills: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  details: string;
  courses: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  sources?: {
    documentName: string;
    pageNumber: number;
    score: number;
    snippet: string;
  }[];
  ragUsed?: boolean;
  groundedInResume?: boolean;
  suggestedAction?: {
    label: string;
    action: () => void;
  };
}

export interface EmbeddingPreset {
  id: string;
  label: string;
  textA: string;
  textB: string;
  expectedRelation: string;
}

export interface WordVectorPoint {
  word: string;
  x: number;
  y: number;
  category: 'data-science' | 'machine-learning' | 'infrastructure' | 'business';
}
