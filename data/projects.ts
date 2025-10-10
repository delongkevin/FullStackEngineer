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
  category: 'frontend' | 'fullstack' | 'mobile';
  features: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Analytics Dashboard",
    description: "Real-time sales dashboard with interactive charts and product management",
    fullDescription: "A comprehensive analytics dashboard for e-commerce businesses providing real-time insights into sales performance, customer behavior, and inventory management. Features interactive data visualizations and automated reporting.",
    image: "/images/dashboard-project.jpg",
    tech: ["React", "TypeScript", "Chart.js", "Node.js", "MongoDB", "Tailwind CSS"],
    liveUrl: "https://dashboard-demo.vercel.app",
    githubUrl: "https://github.com/yourusername/ecommerce-dashboard",
    featured: true,
    category: "fullstack",
    features: [
      "Real-time sales analytics",
      "Interactive data visualizations",
      "Product inventory management",
      "Customer behavior insights",
      "Automated reporting system"
    ]
  },
  {
    id: 2,
    title: "Travel Planning App",
    description: "Interactive travel planner with map integration and itinerary builder",
    fullDescription: "A modern travel planning application that helps users create detailed itineraries, discover points of interest, and collaborate with travel companions. Features real-time map integration and social sharing capabilities.",
    image: "/images/travel-app.jpg",
    tech: ["Next.js", "Mapbox GL JS", "Firebase", "Framer Motion", "Tailwind CSS"],
    liveUrl: "https://travel-planner.vercel.app",
    githubUrl: "https://github.com/yourusername/travel-planner",
    featured: true,
    category: "frontend",
    features: [
      "Interactive map integration",
      "Smart itinerary builder",
      "Collaborative planning",
      "Offline functionality",
      "Social sharing features"
    ]
  },
  {
    id: 3,
    title: "URL Shortener SaaS",
    description: "Custom URL shortener with analytics and team management",
    fullDescription: "A full-stack URL shortening service with advanced analytics, custom domains, and team collaboration features. Built with scalability and performance in mind.",
    image: "/images/url-shortener.jpg",
    tech: ["Next.js", "PostgreSQL", "Prisma", "NextAuth", "Tailwind CSS"],
    liveUrl: "https://linkshort.vercel.app",
    githubUrl: "https://github.com/yourusername/url-shortener",
    featured: true,
    category: "fullstack",
    features: [
      "Custom short URLs",
      "Advanced click analytics",
      "Team collaboration",
      "API access",
      "Bulk URL shortening"
    ]
  },
  {
    id: 4,
    title: "Real-time Chat Application",
    description: "Modern chat app with rooms, emojis, and file sharing",
    fullDescription: "A real-time chat application supporting multiple rooms, direct messaging, file sharing, and rich media messages. Features typing indicators and online status.",
    image: "/images/chat-app.jpg",
    tech: ["React", "Socket.io", "Node.js", "Express", "MongoDB"],
    liveUrl: "https://chat-demo.vercel.app",
    githubUrl: "https://github.com/yourusername/chat-app",
    featured: false,
    category: "fullstack",
    features: [
      "Real-time messaging",
      "Multiple chat rooms",
      "File sharing",
      "Typing indicators",
      "User presence"
    ]
  },
  {
    id: 5,
    title: "Task Management System",
    description: "Kanban-style task manager with drag & drop functionality",
    fullDescription: "A collaborative task management system with Kanban boards, drag-and-drop functionality, and team collaboration features. Perfect for agile development teams.",
    image: "/images/task-manager.jpg",
    tech: ["React", "Redux", "Express", "MongoDB", "React DnD"],
    liveUrl: "https://tasks-demo.vercel.app",
    githubUrl: "https://github.com/yourusername/task-manager",
    featured: false,
    category: "fullstack",
    features: [
      "Drag and drop interface",
      "Team collaboration",
      "Progress tracking",
      "File attachments",
      "Due date reminders"
    ]
  },
  {
    id: 6,
    title: "Weather Dashboard",
    description: "Beautiful weather app with forecasts and severe weather alerts",
    fullDescription: "A responsive weather dashboard providing detailed forecasts, severe weather alerts, and historical data. Features beautiful data visualizations and location-based services.",
    image: "/images/weather-app.jpg",
    tech: ["React", "Chart.js", "Weather API", "Geolocation API", "CSS3"],
    liveUrl: "https://weather-demo.vercel.app",
    githubUrl: "https://github.com/yourusername/weather-app",
    featured: false,
    category: "frontend",
    features: [
      "7-day forecasts",
      "Severe weather alerts",
      "Interactive charts",
      "Location search",
      "Favorite locations"
    ]
  }
];