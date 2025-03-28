import { Project, Experience, Achievement, Skill, ThemeOption } from '../types';

export const projects: Project[] = [
  {
    id: 1,
    title: 'HeartBuddy',
    description: 'Urban healthcare system with AI-powered diagnostics and patient management',
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    category: 'Healthcare',
    technologies: ['React', 'TensorFlow', 'Node.js'],
    githubUrl: 'https://github.com/BhavyaDarda',
    liveUrl: '#'
  },
  {
    id: 2,
    title: 'Internet Speed Test',
    description: 'Accurate network performance measurement tool with beautiful data visualization',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1164&q=80',
    category: 'Utility',
    technologies: ['JavaScript', 'D3.js', 'WebRTC'],
    githubUrl: 'https://github.com/BhavyaDarda',
    liveUrl: '#'
  },
  {
    id: 3,
    title: 'Space Theme Portfolio',
    description: 'Immersive space-themed portfolio website with interactive 3D elements',
    image: 'https://images.unsplash.com/photo-1446776899648-aa78eefe8ed0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80',
    category: 'Portfolio',
    technologies: ['Three.js', 'GSAP', 'React'],
    githubUrl: 'https://github.com/BhavyaDarda',
    liveUrl: '#'
  },
  {
    id: 4,
    title: 'PhotoSphere',
    description: 'Elegant photography portfolio website with advanced image galleries',
    image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
    category: 'Photography',
    technologies: ['Next.js', 'Framer Motion', 'Cloudinary'],
    githubUrl: 'https://github.com/BhavyaDarda',
    liveUrl: '#'
  },
  {
    id: 5,
    title: 'ResearchNinja',
    description: 'AI-powered research agent for content analysis and marketing generation',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1332&q=80',
    category: 'AI Tool',
    technologies: ['Python', 'Langchain', 'OpenAI'],
    githubUrl: 'https://github.com/BhavyaDarda',
    liveUrl: '#'
  }
];

export const experiences: Experience[] = [
  {
    id: 1,
    role: 'Web Application Developer & AI/ML Engineer',
    period: '2021 - Present',
    description: 'Developing innovative web applications and AI solutions for clients. Specializing in React, Node.js, and machine learning integration.',
    skills: ['React', 'TensorFlow', 'Next.js'],
    alignment: 'left'
  },
  {
    id: 2,
    role: 'User Interface Designer',
    period: '2020 - Present',
    description: 'Creating intuitive and visually appealing user interfaces for web and mobile applications using modern design tools and principles.',
    skills: ['Figma', 'Adobe XD', 'Prototyping'],
    alignment: 'right'
  },
  {
    id: 3,
    role: 'Prompt Engineer & NLP Optimization Expert',
    period: '2019 - Present',
    description: 'Designing and optimizing prompts for large language models to achieve specific outputs. Specializing in natural language processing techniques.',
    skills: ['GPT Models', 'NLP', 'LangChain'],
    alignment: 'left'
  }
];

export const achievements: Achievement[] = [
  {
    id: 1,
    title: 'Certified Full-Stack Web Developer',
    description: 'Comprehensive certification in modern web development technologies and best practices',
    year: '2021',
    icon: 'award'
  },
  {
    id: 2,
    title: 'AI & Machine Learning Certification',
    description: 'Advanced certification in artificial intelligence and machine learning algorithms',
    year: '2020',
    icon: 'robot'
  },
  {
    id: 3,
    title: 'MediaTek Community Moderator',
    description: 'Selected as a community leader for the MediaTek developer ecosystem',
    year: '2019',
    icon: 'microchip'
  }
];

export const skills: Skill[] = [
  {
    category: 'Programming',
    icon: 'code',
    items: ['Python', 'JavaScript', 'C', 'Java']
  },
  {
    category: 'Web Development',
    icon: 'globe',
    items: ['React, Next.js', 'Node.js', 'HTML, CSS', 'Python (Streamlit, Flask)']
  },
  {
    category: 'AI & ML',
    icon: 'brain',
    items: ['TensorFlow', 'PyTorch', 'Langchain', 'Langflow']
  },
  {
    category: 'UI/UX Design',
    icon: 'paintBrush',
    items: ['Figma', 'Adobe XD', 'Canva', 'Visual Design Principles']
  }
];

export const tools: string[] = [
  'Git', 'Docker', 'RESTful APIs', 'Generative AI',
  'MongoDB', 'SQL', 'AWS', 'Firebase',
  'Redux', 'GSAP', 'Three.js', 'Tailwind CSS'
];

export const themeOptions: ThemeOption[] = [
  {
    name: 'Classic Gold',
    color: '#d4af37',
    id: 'gold'
  },
  {
    name: 'Emerald Lux',
    color: '#10b981',
    id: 'emerald'
  },
  {
    name: 'Platinum Noir',
    color: '#e5e5e5',
    id: 'platinum'
  }
];

export const aboutInfo = {
  name: 'Bhavya Darda',
  title: 'Web Developer • AI/ML Engineer • UI/UX Designer',
  bio: `I am a passionate and innovative Web Application Developer, AI/ML Engineer, User Interface Designer, and Prompt Engineer dedicated to crafting cutting-edge solutions that seamlessly blend technology and design.

With a strong foundation in full-stack development and a keen eye for aesthetics, I strive to create applications that are both functional and visually captivating. My goal is to push the boundaries of web development and artificial intelligence, delivering products that enhance user experiences and drive technological advancement.`,
  expertise: [
    {
      title: 'Web Development',
      icon: 'code',
      description: 'Creating responsive, dynamic and modern web applications with cutting-edge technologies'
    },
    {
      title: 'AI & Machine Learning',
      icon: 'brain',
      description: 'Building intelligent systems that learn, adapt, and deliver meaningful insights'
    },
    {
      title: 'UI/UX Design',
      icon: 'paintBrush',
      description: 'Designing intuitive, beautiful interfaces that elevate user experiences'
    },
    {
      title: 'Prompt Engineering',
      icon: 'terminal',
      description: 'Optimizing AI prompts to extract maximum value from language models'
    }
  ]
};

export const contactInfo = {
  email: 'dardabhavya775@gmail.com',
  linkedin: 'linkedin.com/in/bhavya-darda5090',
  github: 'github.com/BhavyaDarda',
  socialLinks: ['twitter', 'instagram', 'dribbble', 'medium']
};

export const navLinks = [
  { label: 'ABOUT', href: '#about' },
  { label: 'SKILLS', href: '#skills' },
  { label: 'PROJECTS', href: '#projects' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'ACHIEVEMENTS', href: '#achievements' },
  { label: 'CONTACT', href: '#contact' }
];
