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

export interface EducationItem extends ResumeItem {
  title: string;
  date: string;
  location: string;
  description: string[];
}

export interface ProjectItem extends ResumeItem {
  title: string;
  href?: string;
  description: string[];
}

export interface OpenSourceItem extends ResumeItem {
  title: string;
  href: string;
  description: string[];
}

export const intro: Intro = {
  name: "Appiah Boadu Prince Kwabena",
  about:
    "Computer Engineering graduate specialising in applied machine learning, robotics, and distributed systems. Experienced in building medical imaging pipelines, geospatial revenue platforms, and large-scale retrieval systems.",
  href: "https://blackprince001.github.io",
  github: "https://github.com/blackprince001",
  linkedin: "https://www.linkedin.com/in/pkab23/",
  email: "appiahboaduprince@gmail.com",
  phone: "+233 55 286 3395",
};

export const education: EducationItem[] = [
  {
    title: "Kwame Nkrumah University of Science & Technology",
    date: "2020 – 2024",
    location: "Kumasi, Ghana",
    description: [
      "BSc Computer Engineering — First Class Honors (GPA 3.7/4.0).",
      "Relevant coursework: Data Structures and Algorithms, Operating Systems, Computer Networking, Distributed Systems, Computer Architecture, Digital Signal Processing, Robotics and Computer Vision, Artificial Intelligence and Machine Learning.",
    ],
  },
];

export const research: ResumeItem[] = [
  {
    title: "Research Assistant, AI45D",
    description: [
      "Medical Image Diagnostics: built PyTorch/FastAI/TensorFlow pipelines for brain tumor (ResNet18 + SwinUNet), breast cancer (BI-RADS + pathological), and stroke (Keras CNN) detection with sub-second MRI/histology inference, segmentation masks, and clinical heatmaps. Engineered hybrid ML workflows across dual-mode breast cancer analysis, brain tumor classification and segmentation, stroke triage, and document RAG with cross-encoder reranking, semantic chunking, and SSE streaming for instant, traceable responses.",
      "Zebra Chat — Rare Disease AI Assistant for Health Professionals: designed a RAG-powered dysmorphology expert using Gemini 1.5 Flash, FAISS, and all-MiniLM-L6-v2 to enable real-time, citation-grounded chat with Smith's Recognizable Patterns textbooks. Built scalable, secure backends with JWT auth, PostgreSQL, Cloudinary, automated preprocessing, and modular services supporting user uploads, persistent sessions, saved queries, and seamless model extension.",
    ],
  },
  {
    title:
      "Research Assistant & National Service Personnel, Connected Devices Lab & RAIL Lab",
    location: "Kumasi, Ghana",
    description: [
      "Developed a FastAPI backend with Google Cloud-powered ML inference to automate sentiment analysis on student feedback, enabling real-time trend detection and actionable insights for universities.",
      "Engineered scalable data pipelines to process user-generated content, driving a student-first community where 80% of early adopters reported improved campus engagement.",
      "Assisted in architecting a medical imaging pipeline using PyTorch, deploying an ensemble of CNN and U-Net models for CT scan analysis with 92% diagnostic accuracy supporting clinical decisions.",
    ],
  },
];

export const work: ResumeItem[] = [
  {
    title: "Navigation Intern, 3Farmate Robotics",
    description: [
      "Engineered an autonomous navigation system using ROS/ROS2, implementing A* and Dynamic Window Approach algorithms for precision agriculture and reducing navigation errors across custom-written controllers.",
      "Built differential drive and keyboard-controlled teleoperation controllers alongside a custom model-based farmland environment to validate navigation behaviours before field deployment.",
      "Developed high-fidelity agricultural simulation environments in Gazebo with custom crop models, achieving strong correlation with real-world robot behaviour for vision-based detection systems.",
    ],
  },
  {
    title: "Club Lead, Google Developer Student Clubs (GDSC) KNUST",
    location: "Kumasi, Ghana",
    description: [
      "Led technical community of 400+ developers, organizing 15+ workshops on cloud computing, machine learning, and mobile development with significant participant satisfaction.",
      "Orchestrated 3 major hackathons with 200+ participants and established partnerships with 5 leading Ghanaian technology companies.",
      "Coordinated weekly two-hour sessions exposing 400+ students to programming through in-person events, study jams, and hackathons.",
    ],
  },
  {
    title: "Machine Learning Intern, Omdena Inc",
    location: "Remote",
    description: [
      "Joined the Omdena Ghana Chapter to collaborate with ML engineers on AI-driven social impact projects.",
      "Developed an ML pipeline for credit risk assessment using ensemble methods (Random Forest, XGBoost), achieving 82% prediction accuracy for unbanked populations.",
      "Implemented feature engineering and optimization techniques that improved model performance by 25% while reducing computational overhead.",
    ],
  },
  {
    title: "Interim Student Lead, KNUST College of Engineering",
    location: "Kumasi, Ghana",
    description: [
      "Coordinated science and technology workshops plus hands-on projects, empowering students to apply their skills in real-world scenarios, foster innovation, and build professional networks.",
    ],
  },
];

export const projects: ProjectItem[] = [
  {
    title: "TaxFlow — Revenue Mobilization System (Capstone Project)",
    description: [
      "Engineered a full-stack system with a microservices architecture using React and Go, delivering GIS integration for geospatial mapping and automated SMS/email payment notifications to enhance revenue tracking processes.",
    ],
  },
  {
    title: "AWS Inferentia ML Inference Platform",
    description: [
      "Architected and deployed a high-performance Kubernetes cluster on AWS Inferentia instances using Terraform to automate provisioning of EKS node groups, IAM roles, and security policies.",
      "Containerized a YOLOv8 inference application with a custom Dockerfile optimized for the Neuron SDK, reducing image size and streamlining builds for specialised ML workloads.",
      "Implemented Kubernetes deployment strategies with resource limits, node affinity, tolerations, and health checks to guarantee reliable scheduling and operation of inference pods on specialised hardware.",
    ],
  },
  {
    title: "Troy — NLP Teaching Assistant",
    description: [
      "Designed and engineered a web-based virtual teaching assistant that leverages NLP to provide personalised responses to student queries, enhancing learning experiences through fine-tuned transformer models.",
    ],
  },
  {
    title: "Embeddings Inference Microservice",
    description: [
      "Designed a Dockerised Go microservice with gRPC and HTTP interfaces orchestrated via Docker Compose to deliver distributed embedding inference for AI RAG workloads.",
    ],
  },
  {
    title: "PolyglotRAG — Multi-Source Knowledge Retrieval Engine",
    description: [
      "Built a high-performance Rust-based RAG system to ingest and unify unstructured data from websites, YouTube, PDFs, and audio into a semantically searchable vector database.",
      "Architected a modular, multi-threaded pipeline using channels and shared memory, implemented chunking and embedding workflows with external APIs, and stored vectors in PGVector with a low-latency cosine similarity query API.",
    ],
  },
  {
    title: "Patio",
    description: [
      "Implemented a high-performance, lightweight reverse proxy gateway in Go featuring concurrent request handling, token-bucket rate limiting, a configurable middleware chain, circuit breaker pattern, response caching, and fair rate limiting.",
    ],
  },
  {
    title: "Octopush",
    description: [
      "Built a concurrent HTTP file server in Go leveraging goroutines and channels for parallel uploads and downloads, with chunked transfer encoding and a custom memory pool optimised for large files.",
    ],
  },
  {
    title: "Latticeq (WIP)",
    description: [
      "Developing a distributed P2P database implementing the Raft consensus protocol and event-driven replication via RabbitMQ with eventual consistency and configurable quorum-based writes.",
    ],
  },
];

export const openSource: OpenSourceItem[] = [];

export const writing: ResumeItem[] = [
  {
    title:
      "A Comprehensive Survey of Side-Channel Attacks in IoT Devices: Techniques and Countermeasures (unpublished)",
    description: [
      "Surveyed timing, power, and electromagnetic side-channel attack vectors affecting constrained IoT devices, evaluated algorithmic and hardware countermeasures, and outlined research directions that balance security with performance in pervasive deployments.",
    ],
  },
];

export const skills: ResumeItem[] = [
];

export const certifications: ResumeItem[] = [];