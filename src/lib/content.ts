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
    date: "Jan 2021 – Nov 2024",
    location: "Kumasi, Ghana",
    description: [
      "BSc in Computer Engineering — First Class Honors (GPA 3.7/4.0).",
      "Relevant coursework: Data Structures and Algorithms, Operating Systems, Computer Networking, Distributed Systems, Computer Architecture, Digital Signal Processing, Robotics and Computer Vision, Artificial Intelligence and Machine Learning.",
    ],
  },
];

export const research: ResumeItem[] = [
  {
    title: "Research Assistant, AI4SD",
    date: "Jan 2025 – Oct 2025",
    location: "Kumasi, Ghana",
    description: [
      "Medical Image Diagnostics: built PyTorch/FastAI/TensorFlow pipelines for brain tumor (ResNet18 + SwinUNet), breast cancer (BI-RADS + pathological), and stroke (Keras CNN) detection with sub-second MRI/histology inference, segmentation masks, and clinical heatmaps. Engineered hybrid ML workflows across dual-mode breast cancer analysis, brain tumor classification and segmentation, stroke triage, and document RAG with cross-encoder reranking, semantic chunking, and SSE streaming for instant, traceable responses.",
      "Zebra Chat — Rare Disease AI Assistant for Health Professionals: designed a RAG-powered dysmorphology expert using Gemini 1.5 Flash, FAISS, and all-MiniLM-L6-v2 to enable real-time, citation-grounded chat with Smith's Recognizable Patterns textbooks. Built scalable, secure backends with JWT auth, PostgreSQL, Cloudinary, automated preprocessing, and modular services supporting user uploads, persistent sessions, saved queries, and seamless model extension.",
    ],
  },
  {
    title:
      "Research Assistant & National Service Personnel, Connected Devices Lab & RAIL Lab",
    date: "Oct 2024 – Sept 2025",
    location: "Kumasi, Ghana",
    description: [
      "Developed a FastAPI (Python) backend with Google Cloud-powered ML inference to automate sentiment analysis on student feedback (professor ratings, hostel reviews, etc.), enabling real-time trend detection and actionable insights for universities.",
      "Engineered scalable data pipelines to process user-generated content, driving a student-first community where 80% of early adopters reported improved campus engagement.",
      "Assisted in architecting a medical imaging pipeline using PyTorch, deploying an ensemble of CNN and U-Net models for CT scan analysis with 92% diagnostic accuracy aiding medical decisions.",
    ],
  },
];

export const work: ResumeItem[] = [
  {
    title: "Navigation Intern, 3Farmate Robotics",
    date: "Oct 2024 – Dec 2024",
    location: "Remote",
    description: [
      "Engineered autonomous navigation system using ROS/ROS2, implementing A* and Dynamic Window Approach algorithms for precision agriculture, reducing navigation errors on custom-written navigation controllers.",
      "Built a Differential Drive Controller, a keyboard-controlled Teleop controller, and a custom model-based Farmland environment for navigation.",
      "Developed high-fidelity agricultural simulation environments in Gazebo with custom crop models, achieving high correlation with real-world robot behaviour for Vision-Based Detection Systems.",
    ],
  },
  {
    title: "Club Lead, Google Developer Student Clubs (GDSC) KNUST",
    date: "Aug 2022 – Aug 2023",
    location: "Kumasi, Ghana",
    description: [
      "Led technical community of 400+ developers, organizing 15+ workshops on cloud computing, machine learning, and mobile development with significant participant satisfaction.",
      "Orchestrated 3 major hackathons with 200+ participants, and established partnerships with 5 major Tech Ghanaian companies.",
      "Organized and led 2-hour weekly sessions for 400+ (and growing) college students that focused on exposure to programming through in-person events, study jams, and hackathons.",
    ],
  },
  {
    title: "Machine Learning Intern, Omdena Inc",
    date: "May 2021 – Jan 2022",
    location: "Kumasi, Ghana",
    description: [
      "Interned and became a member of the Ghana Chapter which houses a couple of ML engineers across the Country and beyond, who collaborate on projects to solve problems using AI and Machine Learning.",
      "Developed ML pipeline for credit risk assessment using ensemble methods (Random Forest, XGBoost), achieving 82% prediction accuracy for unbanked populations.",
      "Implemented feature engineering and optimization techniques that improved model performance by 25% while reducing computational overhead.",
    ],
  },
  {
    title: "Interim Student Lead, KNUST College of Engineering",
    date: "July 2023 – Oct 2023",
    location: "Kumasi, Ghana",
    description: [
      "Coordinated science and technology workshops, and hands-on projects to empowering students apply their skills in real-world scenarios, fostering innovation, and building professional networks.",
    ],
  },
];

export const projects: ProjectItem[] = [
  {
    title: "TaxFlow — Revenue Mobilization System (Capstone Project)",
    description: [
      "Engineered a full-stack system with a microservices architecture, using React and Go, featuring GIS-integration for geospatial mapping and automated SMS/email payment notifications to enhance revenue tracking processes.",
    ],
  },
  {
    title: "AWS Inferentia ML Inference Platform",
    description: [
      "Architected and deployed a high-performance Kubernetes cluster on AWS Inferentia instances using Terraform to automate the provisioning of EKS node groups, IAM roles, and security policies, ensuring a reproducible and secure infrastructure foundation.",
      "Containerized a YOLOv8 inference application using a custom Dockerfile optimized for the Neuron SDK, reducing image size and streamlining the build process for machine learning workloads.",
      "Implemented a robust Kubernetes deployment strategy with resource limits, node affinity, tolerations, and health checks (livenessProbe, readinessProbe) to guarantee reliable scheduling and operation of inference pods on specialized hardware.",
    ],
  },
  {
    title: "Troy — NLP Teaching Assistant",
    href: "https://github.com/blackprince001/troy-virtual-assistant",
    description: [
      "Designed and engineered web-based virtual teaching assistant that facilitates interactive learning for students in specific courses. It leverages natural language processing to provide personalized responses to student queries, enhance learning experiences, and support academic interactions using state of the art finetuning for transformers models.",
    ],
  },
  {
    title: "Embeddings Inference Microservice",
    href: "https://github.com/blackprince001/embedding-inference",
    description: [
      "Designed a Dockerized Go microservice infrastructure featuring gRPC and HTTP interfaces managed through Docker Compose for orchestration for distributed AI RAG workloads useful for embedding inference.",
    ],
  },
  {
    title: "PolyglotRAG — Multi-Source Knowledge Retrieval Engine",
    href: "https://github.com/blackprince001/PolyglotRAG",
    description: [
      "Designed and engineered a high-performance RAG system in Rust to ingest, process, and unify unstructured data from diverse sources (websites, YouTube, PDFs, audio) into a single, semantically searchable vector database.",
      "Architected a modular, multi-threaded pipeline using system channels and shared memory for synchronization, ensuring efficient and scalable processing. Implemented chunking and embedding via external APIs, storing vectors in PGVector, and exposed a low-latency query API using cosine similarity for retrieval.",
    ],
  },
  {
    title: "Patio",
    href: "https://github.com/blackprince001/patio",
    description: [
      "High-performance, lightweight reverse proxy gateway in Go featuring concurrent request handling, token-bucket rate limiting, and customizable middleware chain. Implements circuit breaker pattern, response caching and fair rate limiting.",
    ],
  },
  {
    title: "Octopush",
    href: "https://github.com/blackprince001/octopush",
    description: [
      "Concurrent HTTP file server in Go utilizing goroutines and channels for parallel file uploads and downloads using HTTP. Implements chunked transfer encoding and custom memory pool for optimized large file handling.",
    ],
  },
  {
    title: "Latticelq (WIP)",
    href: "https://github.com/blackprince001/latticelq",
    description: [
      "Distributed P2P database implementing Raft consensus protocol and event-driven replication via RabbitMQ. Features eventual consistency model and configurable quorum-based writes.",
    ],
  },
];

export const openSource: OpenSourceItem[] = [];

export const writing: ResumeItem[] = [
  {
    title:
      "A Comprehensive Survey of Side-Channel Attacks in IoT Devices: Techniques and Countermeasures (unpublished)",
    href: "https://blackprince001.github.io/publications/sns.pdf",
    description: [
      "This paper presents a comprehensive survey of side-channel attacks (SCAs) targeting Internet of Things (IoT) devices, a growing area of concern as these devices become increasingly prevalent in critical applications. SCAs exploit unintended information leakage from physical implementations of cryptographic algorithms, threatening the security of IoT devices. We categorize and analyze various SCA techniques, including timing attacks, power analysis, and electromagnetic attacks, highlighting their relevance to IoT devices due to resource constraints and physical accessibility. Furthermore, we review existing countermeasures, both algorithmic and hardware-based, that aim to mitigate these risks. We also discuss the challenges in balancing security with performance and propose future research directions to enhance IoT security against evolving threats.",
    ],
  },
];

export const skills: ResumeItem[] = [
  {
    title: "Languages",
    description: [
      "C/C++, Python, Golang, Java, Rust, Bash, SQL, MATLAB, Verilog",
    ],
  },
  {
    title: "Technologies/Frameworks",
    description: [
      "FastAPI, SciKit-Learn, PyTorch, TensorFlow, GIS, Docker, Kubernetes, Linux, Databases, FPGAs, Xilinx, Computer Vision, ROS1/ROS2",
    ],
  },
];

export const certifications: ResumeItem[] = [
  {
    title: "Certifications",
    description: [
      "Cisco Networking Technician, AWS Fundamentals",
    ],
  },
  {
    title: "Conferences",
    description: [
      "Ghana Digital and Innovation Week 2024, Ghana Data Science Summit (IndabaX Ghana) 2024",
    ],
  },
];