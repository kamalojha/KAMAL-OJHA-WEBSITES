export interface Project {
  id: string;
  title: string;
  category: 'ml_vision' | 'fullstack' | 'systems';
  categoryLabel: string;
  techStack: string[];
  summary: string;
  bulletPoints: string[];
  architectureDetails: {
    overview: string;
    keyChallenge: string;
    solution: string;
    impact: string;
    codeSnippet?: {
      filename: string;
      language: string;
      code: string;
    };
  };
  hasInteractiveDemo: boolean;
  demoType: 'xray' | 'wheat' | 'pglife' | 'network' | 'timeentry' | 'library';
}

export interface SkillCategory {
  title: string;
  description: string;
  skills: {
    name: string;
    level: string; // e.g. "Proficient", "Advanced", "Working Knowledge"
    usedIn: string[];
  }[];
}

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location?: string;
  year: string;
  type: 'internship' | 'training' | 'volunteer';
  description: string;
  keyLearnings: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  location: string;
  period: string;
  highlights: string[];
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  credentialBadge?: string;
  description: string;
  category: 'cloud' | 'software' | 'ai' | 'networking' | 'hackathon' | 'leadership';
}
