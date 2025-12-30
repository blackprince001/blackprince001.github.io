export interface Intro {
  name: string;
  about: string;
  href: string;
  github: string;
  linkedin: string;
  email: string;
  phone: string;
}

export interface ResumeItem {
  title: string;
  href?: string;
  date?: string;
  location?: string;
  description: string[];
}


export interface ProjectItem extends ResumeItem {
  title: string;
  href?: string;
  description: string[];
}

