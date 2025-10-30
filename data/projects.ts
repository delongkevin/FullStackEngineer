export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tech: string[];
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  category: 'Web' | 'fullstack' | 'mobile' | 'Automotive' | 'all';
  features: string[];
  embeddable?: boolean;
  projectPath?: string;
}
export const projects: Project[] = [
  {
    id: 1,
    title: "Blackjack Game",
    description: "Interactive Blackjack card game with realistic gameplay and scoring",
    fullDescription: "A fully functional Blackjack game built with React, featuring realistic card gameplay, dealer AI, score tracking, and smooth animations.",
    image: "/images/blackjack.jpg",
    tech: ["React", "JavaScript", "HTML5", "CSS3"],
    liveUrl: "/projects/blackjack",
    githubUrl: "https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer",
    featured: true,
    category: "mobile",
    features: [
      "Realistic card gameplay",
      "Dealer AI with hit/stand logic",
      "Score tracking system",
      "Responsive design",
      "Smooth animations"
    ],
    embeddable: true,
    projectPath: "/projects/blackjack"
  },
  {
    id: 2,
    title: "Circle Clicker Game",
    description: "Fast-paced reflex testing game with combo multipliers and level progression",
    fullDescription: "An engaging reflex game where players click appearing circles to score points, featuring combo multipliers, progressive difficulty, and performance tracking.",
    image: "/images/circle-clicker.jpg",
    tech: ["JavaScript", "HTML5", "CSS3", "Game Development"],
    liveUrl: "/projects/circle-clicker",
    githubUrl: "https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer",
    featured: true,
    category: "mobile",
    features: [
      "Progressive difficulty levels",
      "Combo multiplier system",
      "Real-time scoring",
      "Performance analytics",
      "Mobile-responsive design"
    ],
    embeddable: true,
    projectPath: "/projects/circle-clicker"
  },
  {
    id: 3,
    title: "Color Match Challenge",
    description: "Color matching game with timed challenges and progressive difficulty",
    fullDescription: "A challenging color matching game that tests perception and speed, featuring timed rounds, progressive difficulty, and accuracy tracking.",
    image: "/images/color-match.jpg",
    tech: ["JavaScript", "HTML5", "CSS3", "Color Theory"],
    liveUrl: "/projects/color-match",
    githubUrl: "https://github.com/delongkevin/FullStackEngineer",
    featured: false,
    category: "mobile",
    features: [
      "Timed challenges",
      "Progressive difficulty",
      "Accuracy tracking",
      "Color theory implementation",
      "Responsive gameplay"
    ],
    embeddable: true,
    projectPath: "/projects/color-match"
  },
  {
    id: 4,
    title: "RideShare Entertainment Center",
    description: "In-car entertainment system with games, climate control, and AI assistant",
    fullDescription: "A comprehensive in-vehicle entertainment platform featuring multiple games, climate control interface, music player, and AI-powered ride assistance.",
    image: "/images/ride-sharing.jpg",
    tech: ["JavaScript", "HTML5", "CSS3", "AI Integration"],
    liveUrl: "/projects/ride-sharing",
    githubUrl: "https://github.com/delongkevin/FullStackEngineer",
    featured: false,
    category: "mobile",
    features: [
      "Multiple mini-games",
      "Climate control simulation",
      "AI ride assistant",
      "Music player integration",
      "Real-time ride information"
    ],
    embeddable: true,
    projectPath: "/projects/ride-sharing"
  },
  {
    id: 5,
    title: "Tic Tac Toe Pro",
    description: "Professional Tic Tac Toe with scoring system and winning animations",
    fullDescription: "A polished Tic Tac Toe game built with React, featuring score tracking, winning animations, and a clean, professional interface.",
    image: "/images/tic-tac-toe.jpg",
    tech: ["React", "JavaScript", "HTML5", "CSS3"],
    liveUrl: "/projects/tic-tac-toe",
    githubUrl: "https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer",
    featured: false,
    category: "mobile",
    features: [
      "Score tracking system",
      "Winning move animations",
      "Responsive design",
      "Game state persistence",
      "Professional UI/UX"
    ],
    embeddable: true,
    projectPath: "/projects/tic-tac-toe"
  },
  {
    id: 6,
    title: "Automotive CAN-Bus Logger",
    description: "Interactive Automotive CAN-bus logger used with Vector CANoe Products!",
    fullDescription: "Python application that will connect to a CAN-driver for CAN-bus applications!",
    image: "/images/can_analyzer.jpg",
    tech: ["CAN", "Python", "HTML5", "CSS3"],
    liveUrl: "/projects/can_analyzer/dist/CAN_Analyzer.exe",
    githubUrl: "https://github.com/delongkevin/FullStackEngineer",
    featured: true,
    category: "Automotive",
    features: [
      "Driver Layer",
      "Responsive design",
      "Professional UI/UX"
    ],
    embeddable: false,
    projectPath: "/projects/can_analyzer/dist/CAN_Analyzer.exe"
  },
  {
    id: 7,
    title: "Camera Object Detection",
    description: "Object Detection with Camera App!",
    fullDescription: "With OpenCV libararies on Object Detection from a camera source!",
    image: "/images/object_detection.jpg",
    tech: ["Python", "Flutter", "CSS3"],
    liveUrl: "/projects/ObjectDetection/object_detection.py",
    githubUrl: "https://github.com/delongkevin/FullStackEngineer",
    featured: true,
    category: "Automotive",
    features: [
      "Python",
	  "Flutter",
      "Responsive design"
    ],
    embeddable: false,
    projectPath: "/projects/ObjectDetection/object_detection.py"
  },
    {
    id: 8,
    title: "Poker App",
    description: "Interactive Poker App!",
    fullDescription: "A polished version with betting, score keeping, highly instrusive UI/UX.",
    image: "/images/pokerapp.jpg",
    tech: ["React-Native", "JavaScript", "CSS3", "Android", "IOS"],
    liveUrl: "/projects/PokerApp/PokerApp.html",
    githubUrl: "https://github.com/delongkevin/FullStackEngineer",
    featured: true,
    category: "mobile",
    features: [
      "Betting",
      "Mobile App Deployment",
      "Responsive design",
      "Review Rating",
      "Professional UI/UX"
    ],
    embeddable: true,
    projectPath: "/projects/PokerApp/PokerApp.html"
  }
  // Add any other projects you have with sequential IDs
];

