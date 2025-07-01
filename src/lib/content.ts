export interface Intro {
  name: string;
  about: string;
  href: string;
  github: string;
  linkedin: string;
  email: string;
}

export interface ResumeItem {
  title: string;
  href?: string;
  date?: string;
  location?: string;
  description: string[];
}

export interface EducationItem extends ResumeItem {
  title: string;
  date: string;
  location: string;
  description: string[];
}

export interface ProjectItem extends ResumeItem {
  title: string;
  href: string;
  description: string[];
}

export interface OpenSourceItem extends ResumeItem {
  title: string;
  href: string;
  description: string[];
}

export const intro: Intro = {
  name: "APPIAH BOADU PRINCE KWABENA",
  about:
    "A Computer Engineering student at KNUST with a passion for software engineering and machine learning. Experienced in developing autonomous navigation systems, backend services, and machine learning models.",
  href: "https://blackprince.tech",
  github: "", // This information is not available in the provided CV
  linkedin: "", // This information is not available in the provided CV
  email: "appiahboaduprince@gmail.com",
};

export const work: ResumeItem[] = [
  {
    title: "Navigation Intern",
    href: "", // This information is not available in the provided CV
    date: "Oct 2024- Dec 2024",
    location: "Remote",
    description: [
      "Engineered autonomous navigation system using ROS/ROS2, implementing A* and Dynamic Window Approach algorithms for precision agriculture, reducing navigation errors on custom written navigation controllers.",
      "Developed high-fidelity agricultural simulation environments in Gazebo with custom crop models, achieving high correlation with real-world robot behaviour for our Vision-Based Detection Systems.",
    ],
  },
  {
    title: "Research Assistant",
    href: "", // This information is not available in the provided CV
    date: "Oct 2024- Present",
    location: "Kumasi, Ghana",
    description: [
      "Developed a FastAPI (Python) backend with Google Cloud-powered ML inference to automate sentiment analysis on student feedback (professor ratings, hostel reviews, etc.), enabling real-time trend detection and actionable insights for universities and testbench organizations on containerization technologies Docker and Kubernetes.",
      "Engineered scalable data pipelines to process user-generated content, driving a student-first community where 80% of early adopters reported improved campus engagement.",
      "Assisted in architecting a medical imaging pipeline using PyTorch, deploying ensemble of CNN and U-Net models for CT scan analysis with 92% diagnostic accuracy aiding medical decisions.",
    ],
  },
  {
    title: "Club Lead",
    href: "", // This information is not available in the provided CV
    date: "Aug 2022-Aug 2023",
    location: "Kumasi, Ghana",
    description: [
      "Led technical community of 400+ developers, organizing 15+ workshops on cloud computing, machine learning, and mobile development with significant participant satisfaction.",
      "Orchestrated 3 major hackathons with 200+ participants, and established partnerships with 5 major Tech Ghanaian companies.",
    ],
  },
  {
    title: "Junior Machine Learning Intern",
    href: "", // This information is not available in the provided CV
    date: "May 2021-Jan 2022",
    location: "Remote",
    description: [
      "Developed ML pipeline for credit risk assessment using ensemble methods (Random Forest, XGBoost), achieving 82% prediction accuracy for unbanked populations.",
      "Implemented feature engineering and optimization techniques that improved model performance by 25% while reducing computational overhead.",
    ],
  },
];

export const education: EducationItem[] = [
  {
    title: "BSc in Computer Engineering",
    date: "2020-2024",
    location: "Kumasi, Ghana",
    description: [
      "Kwame Nkrumah University of Science & Technology",
      "Relevant Coursework: Data Structures and Algorithms, Operating Systems, Computer Networking, Distributed Systems, Computer Architecture, Digital Signal Processing, Robotics and Computer Vision, Artificial Intelligence and Machine Learning.",
    ],
  },
];

export const projects: ProjectItem[] = [
  {
    title: "TaxFlow",
    href: "", // This information is not available in the provided CV
    description: [
      "Engineered a full-stack revenue mobilization and tracking system targeting Ghana's national tax infrastructure.",
      "Implemented GIS-integrated architecture for geospatial revenue mapping, featuring automated payment notifications via SMS/email and real-time transaction processing.",
      "Designed with microservices architecture using React for frontend dashboards and Go for high-performance backend services for geo-based property mapping, payments and notification stack with redis.",
    ],
  },
  {
    title: "Patio",
    href: "", // This information is not available in the provided CV
    description: [
      "High-performance, lightweight reverse proxy gateway in Go featuring concurrent request handling, token-bucket rate limiting, and customizable middleware chain.",
      "Implements circuit breaker pattern, response caching and fair rate limiting.",
    ],
  },
  {
    title: "Octopush",
    href: "", // This information is not available in the provided CV
    description: [
      "Concurrent HTTP file server in Go utilizing goroutines and channels for parallel file uploads and downloads using HTTP.",
      "Implements chunked transfer encoding and custom memory pool for optimized large file handling.",
    ],
  },
  {
    title: "Banking the Unbanked (Ghana)",
    href: "", // This information is not available in the provided CV
    description: [
      "Developed ML classification model using XGBoost to assess creditworthiness of unbanked populations, achieving 82% accuracy.",
      "Implemented feature engineering on demographic and financial behavioral data using scikit-learn.",
    ],
  },
  {
    title: "Latticelq",
    href: "", // This information is not available in the provided CV
    description: [
      "(WIP) Distributed P2P database implementing Raft consensus protocol and event-driven replication via RabbitMQ.",
      "Features eventual consistency model and configurable quorum-based writes.",
    ],
  },
];

export const openSource: OpenSourceItem[] = [];