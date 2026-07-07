export interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface ResumeFormData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: string;
  summary: string;
}

export interface Resume {
  id: string;
  title: string;
  htmlContent: string;
  template: string;
  generatedData: GeneratedResumeData;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeListItem {
  id: string;
  title: string;
  template: string;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
  };
  professionalSummary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    bullets: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
  }>;
  skills: {
    technical: string[];
    soft: string[];
    languages: string[];
  };
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
  }>;
}

export type Template = 'modern' | 'classic' | 'minimal';
export type Step = 1 | 2 | 3 | 4;
