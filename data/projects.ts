export interface Project {
  id: number;
  // Optional slug for clean URLs (e.g., /projects/blackjack)
  slug?: string;
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
    liveUrl: "/projects/blackjack/index.html",
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
    image: "/images/circle_clicker.jpg",
    tech: ["JavaScript", "HTML5", "CSS3", "Game Development"],
    liveUrl: "/projects/circle-clicker/index.html",
    githubUrl: "https://github.com/delongkevin/2025-Portfolio-SoftwareEngineer",
    featured: false,
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
    image: "/images/color_match.jpg",
    tech: ["JavaScript", "HTML5", "CSS3", "Color Theory"],
    liveUrl: "/projects/color-match/index.html",
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
    image: "/images/ride_share_app.jpg",
    tech: ["JavaScript", "HTML5", "CSS3", "AI Integration"],
    liveUrl: "/projects/ride-sharing/index.html",
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
    image: "/images/tictactoe.jpg",
    tech: ["React", "JavaScript", "HTML5", "CSS3"],
    liveUrl: "/projects/tic-tac-toe/index.html",
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
    image: "/images/CAN_Analyzer.jpg",
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
    image: "/images/PokerApp.jpg",
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
  ,
  {
    id: 9,
    title: "Calculator",
    description: "Sleek web calculator with keyboard support, history log, and all standard operations",
    fullDescription: "A polished browser-based calculator featuring arithmetic operations, percentage, sign toggle, a scrollable history log, and full keyboard input support — all in a single self-contained HTML file.",
    image: "/images/calculator.png",
    tech: ["HTML5", "CSS3", "JavaScript"],
    liveUrl: "/projects/calculator/index.html",
    githubUrl: "https://github.com/delongkevin/FullStackEngineer",
    featured: false,
    category: "Web",
    features: [
      "Addition, subtraction, multiplication, division",
      "Percentage and sign-toggle",
      "Scrollable history log (last 10 calculations)",
      "Full keyboard support (0–9, operators, Enter, Backspace, Escape)",
      "Responsive glassmorphism UI"
    ],
    embeddable: true,
    projectPath: "/projects/calculator"
  },
  {
    id: 10,
    title: "Restaurant Menu Browser",
    description: "Interactive restaurant menu with category filters, dietary tags, search, and a cart",
    fullDescription: "A feature-rich restaurant menu web app showcasing Bistro Bliss. Browse 20 dishes across five categories, filter by Vegetarian / Gluten-Free / Spicy tags, live-search, add items to a slide-up cart, and place a mock order — all client-side.",
    image: "/images/restaurant-menu.png",
    tech: ["HTML5", "CSS3", "JavaScript"],
    liveUrl: "/projects/restaurant-menu/index.html",
    githubUrl: "https://github.com/delongkevin/FullStackEngineer",
    featured: true,
    category: "Web",
    features: [
      "20 menu items across 5 categories",
      "Dietary-tag filters (Veg, GF, Spicy)",
      "Live search by name or description",
      "Slide-up shopping cart with order total",
      "One-click order confirmation flow"
    ],
    embeddable: true,
    projectPath: "/projects/restaurant-menu"
  },
  {
    id: 11,
    title: "Online Grocery Order System",
    description: "Full-stack retail ordering app with product catalog, cart, checkout form, and order persistence",
    fullDescription: "ShopQuick is a full-stack grocery ordering demo. Browse 22 products across six categories, manage quantities in a slide-out cart, complete a validated multi-field checkout form with payment fields, and see order confirmation — with order history stored in localStorage.",
    image: "/images/order-system.png",
    tech: ["HTML5", "CSS3", "JavaScript", "localStorage API"],
    liveUrl: "/projects/order-system/index.html",
    githubUrl: "https://github.com/delongkevin/FullStackEngineer",
    featured: true,
    category: "fullstack",
    features: [
      "22 products across 6 category tabs",
      "Slide-out cart with quantity controls and free-delivery threshold",
      "Multi-step checkout with client-side form validation",
      "Payment field formatting (card number, expiry, CVV)",
      "Order confirmation with receipt and localStorage persistence"
    ],
    embeddable: true,
    projectPath: "/projects/order-system"
  },
  {
    id: 12,
    title: "Task Manager",
    description: "Full-stack task management app with CRUD, priority levels, filters, search, and localStorage sync",
    fullDescription: "TaskFlow is a complete task management application. Create, edit, and delete tasks with titles, descriptions, priorities (High / Medium / Low), and categories. Filter by status or priority, search, sort, and track completion progress — all persisted in localStorage.",
    image: "/images/task-manager.png",
    tech: ["HTML5", "CSS3", "JavaScript", "localStorage API"],
    liveUrl: "/projects/task-manager/index.html",
    githubUrl: "https://github.com/delongkevin/FullStackEngineer",
    featured: false,
    category: "fullstack",
    features: [
      "Create, edit, and delete tasks (full CRUD)",
      "Priority levels: High, Medium, Low with color coding",
      "Category labels: Work, Personal, Shopping, Health, Learning",
      "Filter by All / Active / Completed / High-priority",
      "Live search, sort options, progress bar, and localStorage sync"
    ],
    embeddable: true,
    projectPath: "/projects/task-manager"
  },
  {
    id: 13,
    slug: 'dornerworks-iot',
    title: 'Medical IoT Device Monitor',
    description: 'Cross-platform medical IoT app showcasing BLE connectivity, real-time vitals, wearable support, and secure REST APIs — built for DornerWorks',
    fullDescription: 'MedIoT Connect is an interactive mobile app demo built to highlight Senior Mobile Developer competencies for DornerWorks. It demonstrates cross-platform development (iOS/Swift, Android/Kotlin, Flutter, React Native), real-time BLE 5.x device connectivity, live medical vitals monitoring, Apple Watch / Wear OS / Garmin wearable integrations, RESTful API communication, OAuth 2.0 security, and HIPAA-compliant data handling — all areas directly aligned with DornerWorks connected Medical and IoT products.',
    image: '/images/dornerworks-iot.svg',
    tech: ['Swift', 'Kotlin', 'Flutter', 'React Native', 'TypeScript', 'BLE 5.x', 'NFC', 'REST API', 'OAuth 2.0', 'WatchKit', 'Wear OS'],
    liveUrl: '/projects/dornerworks-iot/index.html',
    githubUrl: 'https://github.com/delongkevin/FullStackEngineer',
    featured: true,
    category: 'mobile',
    features: [
      'Cross-platform iOS (Swift/Xcode) & Android (Kotlin/Android Studio) development',
      'Flutter & React Native cross-platform UI with native-feel navigation',
      'Real-time BLE 5.x medical device connectivity (cardiac monitor, infusion pump, ventilator)',
      'NFC patient wristband pairing and device management',
      'Live ECG trace, heart rate, SpO₂, temperature & blood pressure monitoring',
      'Apple Watch (WatchKit), Wear OS, and Garmin Connect IQ wearable support',
      'RESTful API integration with JWT/OAuth 2.0 authentication and certificate pinning',
      'HIPAA-compliant security: AES-256 encryption, biometric auth, App Transport Security',
      'App Store / Play Store / enterprise (TestFlight, ad-hoc) distribution experience',
      'Professional medical-grade UI/UX with real-time alerts and patient management',
    ],
    embeddable: true,
    projectPath: '/projects/dornerworks-iot',
  },
  // Add any other projects you have with sequential IDs
];

