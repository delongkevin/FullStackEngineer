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
  category: 'frontend' | 'fullstack' | 'mobile' | 'interactive';
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
    image: "/images/projects/blackjack.jpg",
    tech: ["React", "JavaScript", "HTML5", "CSS3"],
    liveUrl: "/projects/blackjack",
    githubUrl: "https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer",
    featured: true,
    category: "interactive",
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
    image: "/images/projects/circle-clicker.jpg",
    tech: ["JavaScript", "HTML5", "CSS3", "Game Development"],
    liveUrl: "/projects/circle-clicker",
    githubUrl: "https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer",
    featured: true,
    category: "interactive",
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
    image: "/images/projects/color-match.jpg",
    tech: ["JavaScript", "HTML5", "CSS3", "Color Theory"],
    liveUrl: "/projects/color-match",
    githubUrl: "https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer",
    featured: false,
    category: "interactive",
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
    image: "/images/projects/ride-sharing.jpg",
    tech: ["JavaScript", "HTML5", "CSS3", "AI Integration"],
    liveUrl: "/projects/ride-sharing",
    githubUrl: "https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer",
    featured: false,
    category: "interactive",
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
    image: "/images/projects/tic-tac-toe.jpg",
    tech: ["React", "JavaScript", "HTML5", "CSS3"],
    liveUrl: "/projects/tic-tac-toe",
    githubUrl: "https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer",
    featured: false,
    category: "interactive",
    features: [
      "Score tracking system",
      "Winning move animations",
      "Responsive design",
      "Game state persistence",
      "Professional UI/UX"
    ],
    embeddable: true,
    projectPath: "/projects/tic-tac-toe"
  }
  // Add any other projects you have with sequential IDs
];
