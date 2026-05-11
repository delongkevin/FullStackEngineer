export interface TutorialStep {
  title: string;
  description: string;
  instructions: string[];
  tips?: string[];
}

export interface ProjectTutorial {
  projectId: number;
  steps: TutorialStep[];
}

export const projectTutorials: ProjectTutorial[] = [
  {
    projectId: 1, // Blackjack Game
    steps: [
      {
        title: "Welcome to Blackjack",
        description: "Learn how to play this classic card game with realistic dealer AI and smooth animations.",
        instructions: [
          "Click 'Deal' to start a new game",
          "You'll receive two cards face-up",
          "The dealer gets one card face-up and one face-down",
          "Your goal is to get as close to 21 as possible without going over"
        ],
        tips: [
          "Face cards (J, Q, K) are worth 10 points",
          "Aces can be worth 1 or 11 points"
        ]
      },
      {
        title: "Making Your Move",
        description: "Choose your action based on your hand and the dealer's visible card.",
        instructions: [
          "Click 'Hit' to receive another card",
          "Click 'Stand' when you're satisfied with your hand",
          "If your total exceeds 21, you bust and lose",
          "Try to beat the dealer's hand without going over 21"
        ],
        tips: [
          "Stand on 17 or higher is often a safe strategy",
          "Consider the dealer's visible card when deciding"
        ]
      },
      {
        title: "Winning & Scoring",
        description: "Understand how to win and track your performance.",
        instructions: [
          "Win by having a higher hand than the dealer (without busting)",
          "Win automatically if the dealer busts",
          "Get a 'Blackjack' with an Ace + 10-value card for the best hand",
          "Your score is tracked across multiple rounds"
        ],
        tips: [
          "Blackjack (21 with 2 cards) beats a regular 21",
          "Ties result in a push - your bet is returned"
        ]
      }
    ]
  },
  {
    projectId: 2, // Circle Clicker Game
    steps: [
      {
        title: "Getting Started",
        description: "Test your reflexes in this fast-paced clicking challenge.",
        instructions: [
          "Click the 'Start Game' button to begin",
          "Circles will appear randomly on the screen",
          "Click each circle as quickly as possible before it disappears",
          "Each successful click earns you points"
        ],
        tips: [
          "Stay focused and keep your mouse ready",
          "Click quickly to maximize your score"
        ]
      },
      {
        title: "Combos & Multipliers",
        description: "Master the combo system to boost your score.",
        instructions: [
          "Click circles in rapid succession to build combos",
          "Higher combos unlock score multipliers",
          "Missing a circle breaks your combo streak",
          "Watch the combo meter at the top of the screen"
        ],
        tips: [
          "Maintain accuracy for better combo chains",
          "Combos dramatically increase your score"
        ]
      },
      {
        title: "Progressive Difficulty",
        description: "Challenge yourself as the game gets harder.",
        instructions: [
          "Circles appear faster as you progress",
          "Circle lifetime decreases with each level",
          "Your reaction time is tested as difficulty increases",
          "Check your performance analytics after each game"
        ],
        tips: [
          "Practice improves reaction time",
          "Track your progress across sessions"
        ]
      }
    ]
  },
  {
    projectId: 3, // Color Match Challenge
    steps: [
      {
        title: "Understanding the Game",
        description: "Test your color perception and matching skills.",
        instructions: [
          "Click 'Start' to begin a timed challenge",
          "You'll see a target color at the top",
          "Select the matching color from the options below",
          "Complete as many matches as possible before time runs out"
        ],
        tips: [
          "Look carefully at subtle color differences",
          "Speed and accuracy both matter"
        ]
      },
      {
        title: "Playing Efficiently",
        description: "Maximize your score with quick and accurate selections.",
        instructions: [
          "Compare the target color with all options",
          "Click your chosen color",
          "Correct answers add to your score",
          "Wrong answers may reduce your score or time"
        ],
        tips: [
          "Trust your first instinct",
          "Don't second-guess too much - time is limited"
        ]
      },
      {
        title: "Tracking Progress",
        description: "Monitor your accuracy and improvement over time.",
        instructions: [
          "Your accuracy percentage is shown during gameplay",
          "Total matches and time remaining are displayed",
          "Review your final score at the end",
          "Try to beat your high score in subsequent rounds"
        ],
        tips: [
          "Consistent practice improves color perception",
          "Challenge yourself to improve accuracy"
        ]
      }
    ]
  },
  {
    projectId: 4, // RideShare Entertainment Center
    steps: [
      {
        title: "Entertainment Dashboard",
        description: "Navigate the in-car entertainment system interface.",
        instructions: [
          "View the main dashboard with multiple entertainment options",
          "Browse available mini-games",
          "Access music player controls",
          "Check ride information and AI assistant"
        ],
        tips: [
          "All features work in demo mode",
          "Navigate using the menu buttons"
        ]
      },
      {
        title: "Playing Games",
        description: "Enjoy various mini-games during your ride.",
        instructions: [
          "Select a game from the entertainment menu",
          "Follow on-screen instructions for each game",
          "Return to the main menu anytime",
          "Try different games for variety"
        ],
        tips: [
          "Games are optimized for quick sessions",
          "Perfect for short rides"
        ]
      },
      {
        title: "Climate & AI Features",
        description: "Explore climate control and AI assistance.",
        instructions: [
          "Access climate controls from the main menu",
          "Adjust temperature and fan settings",
          "Interact with the AI assistant for ride help",
          "View real-time ride information"
        ],
        tips: [
          "Climate controls are simulated in demo mode",
          "AI assistant provides helpful ride tips"
        ]
      }
    ]
  },
  {
    projectId: 5, // Tic Tac Toe Pro
    steps: [
      {
        title: "Starting a Game",
        description: "Play the classic Tic Tac Toe with a modern interface.",
        instructions: [
          "Click any empty square to place your X",
          "The computer (O) will respond automatically",
          "Try to get three in a row horizontally, vertically, or diagonally",
          "The game announces the winner or a draw"
        ],
        tips: [
          "X always goes first",
          "Plan your moves ahead"
        ]
      },
      {
        title: "Winning Strategies",
        description: "Learn effective tactics to win more games.",
        instructions: [
          "Control the center square when possible",
          "Create two winning possibilities at once (fork)",
          "Block opponent's winning moves",
          "Corner squares are stronger than edge squares"
        ],
        tips: [
          "The computer plays strategically",
          "Perfect play leads to draws"
        ]
      },
      {
        title: "Score Tracking",
        description: "Monitor your performance across multiple games.",
        instructions: [
          "Your wins, losses, and draws are tracked",
          "Click 'New Game' to play again",
          "Try to maintain a positive win rate",
          "Scores persist during your session"
        ],
        tips: [
          "Learn from each game",
          "Analyze winning patterns"
        ]
      }
    ]
  },
  {
    projectId: 6, // Automotive CAN-Bus Logger
    steps: [
      {
        title: "Application Overview",
        description: "Desktop tool for automotive CAN network diagnostics.",
        instructions: [
          "Download the executable from the project page",
          "Connect a compatible CAN interface to your computer",
          "Launch CAN_Analyzer.exe",
          "The app will detect available CAN hardware"
        ],
        tips: [
          "Requires compatible CAN interface hardware",
          "Supports CAN and CAN-FD protocols"
        ]
      },
      {
        title: "Live Frame Capture",
        description: "Monitor and analyze real-time CAN bus traffic.",
        instructions: [
          "Select your CAN interface from the dropdown",
          "Set the appropriate baud rate",
          "Click 'Start Capture' to begin logging",
          "View live CAN frames in the trace window"
        ],
        tips: [
          "Common baud rates: 125k, 250k, 500k, 1Mbps",
          "Frames are displayed in real-time"
        ]
      },
      {
        title: "Filtering & Export",
        description: "Filter messages and export data for analysis.",
        instructions: [
          "Use ID filters to show specific CAN messages",
          "Apply timestamp and data filters as needed",
          "Export captured frames to CSV or log files",
          "Data is compatible with Vector tools"
        ],
        tips: [
          "Filters help reduce noise in busy networks",
          "Export data for offline analysis"
        ]
      }
    ]
  },
  {
    projectId: 7, // Camera Object Detection
    steps: [
      {
        title: "Setup Requirements",
        description: "Python-based real-time object detection application.",
        instructions: [
          "Install Python 3.7+ and required dependencies",
          "Install OpenCV: pip install opencv-python",
          "Ensure you have a working webcam",
          "Download the object detection model files"
        ],
        tips: [
          "Check requirements.txt for all dependencies",
          "Camera permissions may be required"
        ]
      },
      {
        title: "Running Detection",
        description: "Launch the object detection application.",
        instructions: [
          "Run: python object_detection.py",
          "Allow camera access when prompted",
          "The app will begin processing video frames",
          "Detected objects appear with bounding boxes"
        ],
        tips: [
          "Good lighting improves detection accuracy",
          "Position objects clearly in frame"
        ]
      },
      {
        title: "Understanding Results",
        description: "Interpret detection confidence and outputs.",
        instructions: [
          "Each detection shows a confidence score (0-100%)",
          "Higher scores indicate stronger detections",
          "Bounding boxes highlight detected objects",
          "FPS counter shows processing performance"
        ],
        tips: [
          "Confidence >70% is generally reliable",
          "Multiple objects can be detected simultaneously"
        ]
      }
    ]
  },
  {
    projectId: 8, // Poker App
    steps: [
      {
        title: "Getting Started",
        description: "Play Texas Hold'em poker on mobile devices.",
        instructions: [
          "Download the APK for Android or view iOS source",
          "Install and launch the Poker App",
          "Start a new game from the main menu",
          "You'll receive two hole cards"
        ],
        tips: [
          "Works on both Android and iOS",
          "Optimized for mobile touchscreens"
        ]
      },
      {
        title: "Betting Actions",
        description: "Understand betting options and game flow.",
        instructions: [
          "Choose Check, Call, Raise, or Fold each turn",
          "Your chips and pot total are always visible",
          "Community cards are revealed in stages (Flop, Turn, River)",
          "Best 5-card hand wins the pot"
        ],
        tips: [
          "Fold weak hands to conserve chips",
          "Raise with strong hands to maximize winnings"
        ]
      },
      {
        title: "Hand Rankings",
        description: "Learn poker hand values from highest to lowest.",
        instructions: [
          "Royal Flush (A-K-Q-J-10 of same suit) - highest",
          "Straight Flush, Four of a Kind, Full House",
          "Flush, Straight, Three of a Kind",
          "Two Pair, One Pair, High Card - lowest"
        ],
        tips: [
          "Memorize hand rankings to play effectively",
          "Position matters in betting strategy"
        ]
      }
    ]
  },
  {
    projectId: 9, // Calculator
    steps: [
      {
        title: "Basic Operations",
        description: "A full-featured calculator with keyboard support.",
        instructions: [
          "Click number buttons or use keyboard (0-9)",
          "Click operator buttons (+, -, ×, ÷) or use keyboard",
          "Press '=' or Enter to calculate result",
          "Use 'AC' or Escape to clear"
        ],
        tips: [
          "Full keyboard support for faster input",
          "Decimal point available for precise calculations"
        ]
      },
      {
        title: "Advanced Features",
        description: "Utilize percentage, sign toggle, and history.",
        instructions: [
          "Click '%' to convert to percentage",
          "Click '+/-' to toggle positive/negative",
          "Backspace key removes last digit",
          "View calculation history in the log below"
        ],
        tips: [
          "History shows your last 10 calculations",
          "Perfect for checking previous results"
        ]
      },
      {
        title: "Keyboard Shortcuts",
        description: "Master keyboard input for maximum efficiency.",
        instructions: [
          "Numbers: 0-9 keys",
          "Operators: +, -, *, / keys",
          "Calculate: Enter or = key",
          "Clear: Escape key, Backspace to delete"
        ],
        tips: [
          "Keyboard input is faster than clicking",
          "Works just like a desktop calculator"
        ]
      }
    ]
  },
  {
    projectId: 10, // Restaurant Menu Browser
    steps: [
      {
        title: "Browsing the Menu",
        description: "Explore Bistro Bliss's menu with 20 dishes across 5 categories.",
        instructions: [
          "Click category tabs to filter dishes (Appetizers, Mains, Sides, Desserts, Drinks)",
          "View dish photos, names, descriptions, and prices",
          "Look for dietary tags: Vegetarian, Gluten-Free, Spicy",
          "Use the search bar to find specific dishes"
        ],
        tips: [
          "Dietary filters help find suitable options quickly",
          "Search works on dish names and descriptions"
        ]
      },
      {
        title: "Adding to Cart",
        description: "Build your order with the shopping cart.",
        instructions: [
          "Click 'Add to Cart' on any menu item",
          "Cart slides up from the bottom showing your selections",
          "Adjust quantities with +/- buttons",
          "View running total of your order"
        ],
        tips: [
          "Cart remembers your selections as you browse",
          "Remove items by reducing quantity to zero"
        ]
      },
      {
        title: "Placing Your Order",
        description: "Complete the ordering process.",
        instructions: [
          "Review your cart contents and total",
          "Click 'Place Order' when ready",
          "Receive order confirmation",
          "Order details are displayed for your reference"
        ],
        tips: [
          "This is a demo - no actual order is placed",
          "Try different combinations to see cart in action"
        ]
      }
    ]
  },
  {
    projectId: 11, // Online Grocery Order System
    steps: [
      {
        title: "Shopping for Groceries",
        description: "Browse ShopQuick's catalog of 22 products across 6 categories.",
        instructions: [
          "Click category tabs to view different product types",
          "See product images, names, and prices",
          "Click 'Add to Cart' to select items",
          "Adjust quantities directly in the cart"
        ],
        tips: [
          "Free delivery threshold is shown in cart",
          "Categories include Produce, Dairy, Bakery, Meat, Snacks, Beverages"
        ]
      },
      {
        title: "Managing Your Cart",
        description: "Review and modify your shopping cart.",
        instructions: [
          "Click cart icon to open slide-out cart panel",
          "Use +/- buttons to adjust item quantities",
          "Remove items by clicking the trash icon",
          "See subtotal and free delivery progress"
        ],
        tips: [
          "Cart updates prices automatically",
          "Watch for free delivery threshold"
        ]
      },
      {
        title: "Checkout Process",
        description: "Complete your order with validated checkout form.",
        instructions: [
          "Click 'Proceed to Checkout' from cart",
          "Fill in delivery address and contact info",
          "Enter payment details (card number, expiry, CVV)",
          "Review order confirmation with receipt"
        ],
        tips: [
          "Form validates all fields before submission",
          "Order history is saved in browser localStorage"
        ]
      }
    ]
  },
  {
    projectId: 12, // Task Manager
    steps: [
      {
        title: "Creating Tasks",
        description: "Add and organize tasks with TaskFlow.",
        instructions: [
          "Click 'Add Task' button to create new task",
          "Enter task title and description",
          "Select priority level: High, Medium, or Low",
          "Choose a category: Work, Personal, Shopping, Health, or Learning"
        ],
        tips: [
          "Priority levels are color-coded for quick recognition",
          "Tasks are saved automatically to localStorage"
        ]
      },
      {
        title: "Managing Tasks",
        description: "Edit, complete, and organize your task list.",
        instructions: [
          "Click checkbox to mark tasks as complete",
          "Use edit icon to modify task details",
          "Click delete icon to remove tasks",
          "Filter by All, Active, Completed, or High-priority"
        ],
        tips: [
          "Completed tasks show with strikethrough",
          "Progress bar shows completion percentage"
        ]
      },
      {
        title: "Search & Sort",
        description: "Find and organize tasks efficiently.",
        instructions: [
          "Use search bar to filter by keywords",
          "Sort tasks by date, priority, or category",
          "Apply multiple filters simultaneously",
          "View task statistics in the progress bar"
        ],
        tips: [
          "Search looks through titles and descriptions",
          "All changes persist in browser storage"
        ]
      }
    ]
  },
  {
    projectId: 13, // Medical IoT Device Monitor
    steps: [
      {
        title: "Device Connectivity",
        description: "Connect to medical IoT devices via Bluetooth Low Energy.",
        instructions: [
          "Launch MedIoT Connect app on iOS or Android",
          "Enable Bluetooth and grant permissions",
          "Scan for nearby BLE medical devices",
          "Pair with cardiac monitors, infusion pumps, or ventilators"
        ],
        tips: [
          "BLE 5.x provides reliable connectivity up to 30 feet",
          "NFC pairing available for patient wristbands"
        ]
      },
      {
        title: "Monitoring Vitals",
        description: "View real-time medical data from connected devices.",
        instructions: [
          "View live ECG trace on main dashboard",
          "Monitor heart rate, SpO₂, temperature, and blood pressure",
          "Check infusion pump rates and volumes",
          "View ventilator settings and patient metrics"
        ],
        tips: [
          "All data is HIPAA-compliant and encrypted",
          "Alerts trigger for out-of-range values"
        ]
      },
      {
        title: "Wearable Integration",
        description: "Sync with Apple Watch, Wear OS, and Garmin devices.",
        instructions: [
          "Connect Apple Watch for WatchKit integration",
          "Pair Wear OS devices for extended monitoring",
          "Sync with Garmin Connect IQ for fitness data",
          "View vitals summary on wearable displays"
        ],
        tips: [
          "Wearables provide continuous monitoring",
          "Data syncs automatically via cloud API"
        ]
      }
    ]
  },
  {
    projectId: 14, // Kamps Smart Factory Platform
    steps: [
      {
        title: "PLC Integration",
        description: "Connect to Allen-Bradley and Siemens PLCs for real-time data.",
        instructions: [
          "View PLC dashboard showing connected controllers",
          "Monitor Allen-Bradley Modbus TCP sensor data",
          "Check Siemens S7 OPC-UA device status",
          "View real-time MQTT sensor telemetry"
        ],
        tips: [
          "MQTT pub/sub enables real-time updates",
          "Sensor data refreshes every second"
        ]
      },
      {
        title: "YOLOv8 Pallet Detection",
        description: "Monitor AI-powered computer vision for pallet tracking.",
        instructions: [
          "View live camera feed with bounding box detection",
          "See pallet detection at 28 FPS performance",
          "Review detection confidence scores",
          "Monitor OpenCV/PyTorch/TensorFlow pipeline"
        ],
        tips: [
          "YOLOv8 provides accurate real-time detection",
          "Green boxes indicate high-confidence detections"
        ]
      },
      {
        title: "K3s Microservices Dashboard",
        description: "Monitor containerized services and observability metrics.",
        instructions: [
          "View 7 running microservices in K3s cluster",
          "Check vision-api, plc-bridge, and api-gateway status",
          "Monitor Postgres 16 database health",
          "View Prometheus metrics and Grafana dashboards"
        ],
        tips: [
          "All services run in lightweight K3s cluster",
          "Grafana provides real-time observability"
        ]
      }
    ]
  },
  {
    projectId: 15, // Embedded Video Systems Engineer
    steps: [
      {
        title: "Codec Configuration",
        description: "Configure video encoding parameters for H.265/H.264/AV1.",
        instructions: [
          "Select codec type from dropdown (H.265, H.264, AV1, MJPEG)",
          "Adjust bitrate slider for quality vs file size",
          "Set GOP size for keyframe intervals",
          "Tune QP (Quantization Parameter) for compression"
        ],
        tips: [
          "H.265 provides best compression efficiency",
          "Lower QP = higher quality but larger files"
        ]
      },
      {
        title: "Live Video Monitoring",
        description: "View real-time 4K video with object detection overlay.",
        instructions: [
          "Watch animated 4K video feed at 30fps",
          "See real-time bounding box object detection",
          "Monitor video resolution and frame rate",
          "Check encoding performance metrics"
        ],
        tips: [
          "Bounding boxes show detected objects in frame",
          "FPS counter indicates real-time performance"
        ]
      },
      {
        title: "SoC Performance Dashboard",
        description: "Monitor NXP i.MX8M Plus system resources.",
        instructions: [
          "View CPU utilization across all cores",
          "Monitor GPU/VPU hardware acceleration",
          "Check SoC temperature and thermal throttling",
          "Review memory usage and PCIe bandwidth"
        ],
        tips: [
          "VPU acceleration enables efficient video encoding",
          "Temperature monitoring prevents thermal issues"
        ]
      }
    ]
  },
  {
    projectId: 16, // Computer Store App
    steps: [
      {
        title: "Browsing Products",
        description: "Explore computers and electronics catalog.",
        instructions: [
          "View product catalog with images and prices",
          "Browse categories for laptops, desktops, accessories",
          "Use search to find specific products",
          "Click product cards for detailed specifications"
        ],
        tips: [
          "Available on Android APK and iOS IPA",
          "Built with Expo for cross-platform compatibility"
        ]
      },
      {
        title: "Shopping Cart",
        description: "Manage your selections with cart functionality.",
        instructions: [
          "Add products to cart from detail pages",
          "Adjust quantities with +/- controls",
          "View running total with price calculations",
          "Remove items from cart as needed"
        ],
        tips: [
          "Cart persists as you browse",
          "Real-time price updates"
        ]
      },
      {
        title: "Checkout with Stripe",
        description: "Complete purchases with integrated Stripe payments.",
        instructions: [
          "Proceed to checkout from cart",
          "Enter shipping and billing information",
          "Payment processed via Stripe integration",
          "Receive order confirmation with details"
        ],
        tips: [
          "Stripe provides secure payment processing",
          "Push notifications for order updates"
        ]
      }
    ]
  },
  {
    projectId: 17, // Book App Android
    steps: [
      {
        title: "Browsing the Catalog",
        description: "Explore books with native Android Material Design.",
        instructions: [
          "Browse book catalog with cover art",
          "Filter by genre categories",
          "View book details including title, author, price",
          "Native Android app targeting API 26+"
        ],
        tips: [
          "Built with Kotlin for performance",
          "Material Design provides intuitive UI"
        ]
      },
      {
        title: "Shopping Cart",
        description: "Manage your book selections.",
        instructions: [
          "Add books to cart from detail view",
          "Cart fragment shows selected items",
          "Adjust quantities with controls",
          "View subtotal and pricing"
        ],
        tips: [
          "Cart uses Fragment architecture",
          "Quantity controls update price instantly"
        ]
      },
      {
        title: "Checkout Process",
        description: "Complete your book order.",
        instructions: [
          "Review cart contents before checkout",
          "Enter delivery information",
          "Process order through checkout flow",
          "Track order status after purchase"
        ],
        tips: [
          "Native Android performance",
          "Order tracking integrated"
        ]
      }
    ]
  },
  {
    projectId: 18, // Avionics Test Systems Engineer
    steps: [
      {
        title: "NI TestStand Sequences",
        description: "Execute automated test sequences for avionics LRUs.",
        instructions: [
          "View TestStand sequence runner with test steps",
          "Execute LRU Functional, ARINC 429, Power Supply tests",
          "Monitor CAN Bus and RS-422 test execution",
          "See animated step-by-step progress"
        ],
        tips: [
          "Each test shows pass/fail status",
          "Execution times displayed per step"
        ]
      },
      {
        title: "ARINC 429 Bus Monitor",
        description: "Monitor aviation data bus with label decoding.",
        instructions: [
          "View live ARINC 429 frame trace",
          "See decoded labels: Altitude, IAS, Heading, Acceleration",
          "Check SSM/SDI fields and parity validation",
          "Monitor scrolling bus log with timestamps"
        ],
        tips: [
          "ARINC 429 is aviation standard data bus",
          "Parity check ensures data integrity"
        ]
      },
      {
        title: "CAN & Signal Analysis",
        description: "Analyze CAN ISO 11898 frames and bus load.",
        instructions: [
          "View CAN frame trace with ID, DLC, data bytes",
          "Monitor bus load percentage in real-time",
          "Check node names and message frequencies",
          "Analyze signal conditioning and root-cause issues"
        ],
        tips: [
          "High bus load may indicate communication issues",
          "Frame analysis helps debug protocol problems"
        ]
      }
    ]
  },
  {
    projectId: 19, // SQL & XML Data Operations Platform
    steps: [
      {
        title: "SQL Query Console",
        description: "Execute SQL queries against in-memory database.",
        instructions: [
          "Write SQL in the console editor",
          "Execute complex JOINs, subqueries, and GROUP BY",
          "Run aggregation queries and reconciliation checks",
          "View EXPLAIN plans for query optimization"
        ],
        tips: [
          "500-row in-memory relational database",
          "Supports full SQL syntax including CTEs"
        ]
      },
      {
        title: "XML Ingestion Pipeline",
        description: "Process XML with 5-stage validation pipeline.",
        instructions: [
          "Watch animated pipeline: Ingest → Parse → Validate → Transform → Load",
          "Native DOMParser handles XML parsing",
          "Real schema validation catches errors",
          "View error detection and handling"
        ],
        tips: [
          "Each stage shows progress indicators",
          "Validation ensures XML compliance"
        ]
      },
      {
        title: "Batch Job Monitoring",
        description: "Track scheduled ETL and archival jobs.",
        instructions: [
          "View 8 scheduled batch jobs with status",
          "Monitor ETL and archival job execution",
          "See 24-hour run history chart",
          "Rerun jobs and view execution logs"
        ],
        tips: [
          "Status indicators show job health",
          "Logs help troubleshoot failed jobs"
        ]
      }
    ]
  },
  {
    projectId: 20, // Software QA Analyst Platform
    steps: [
      {
        title: "Test Case Management",
        description: "Create and execute manual test cases across suites.",
        instructions: [
          "Browse test suites: Login & Auth, API, Database, UI Regression, CI/CD",
          "Create new test cases with steps and expected results",
          "Execute tests and mark as Pass, Fail, Pending, or Blocked",
          "Filter tests by suite, status, or priority"
        ],
        tips: [
          "Color-coded status makes tracking easy",
          "Test cases support full CRUD operations"
        ]
      },
      {
        title: "Defect Tracking",
        description: "Log and manage defects with Kanban board.",
        instructions: [
          "Log new defects with severity and component",
          "Drag tickets through: Open → In Progress → Resolved → Closed",
          "Filter by severity: Critical, High, Medium, Low",
          "View defect metrics and aging"
        ],
        tips: [
          "Kanban board visualizes workflow",
          "48 sample defects for demo"
        ]
      },
      {
        title: "SQL Test Validation",
        description: "Execute SQL queries against test database.",
        instructions: [
          "Write SQL queries in validator console",
          "Query test_cases, defects, and test_runs tables",
          "Use JOINs, GROUP BY, WHERE, and LIMIT clauses",
          "View results from in-memory database"
        ],
        tips: [
          "72 test cases, 48 defects, 500 test runs available",
          "Validate data-driven test scenarios"
        ]
      }
    ]
  },
  {
    projectId: 21, // System Integration Test Management Dashboard
    steps: [
      {
        title: "Test Plan Manager",
        description: "Create and track integration test plans.",
        instructions: [
          "Create Acceptance, Regression, Performance, or Volume test plans",
          "Assign engineers and target systems",
          "Set dates and track completion progress",
          "View progress bars for each plan"
        ],
        tips: [
          "Plan types align with commissioning phases",
          "Progress tracked automatically from test cases"
        ]
      },
      {
        title: "Test Case Tracker",
        description: "Manage test cases across functional areas.",
        instructions: [
          "Create test cases for: Conveyor, Sortation, WMS, PLC, Safety, HMI, Network, Database",
          "Set priority levels and execution status",
          "Filter by functional area or status",
          "Full CRUD operations supported"
        ],
        tips: [
          "8 functional areas cover complete system",
          "Status filters help focus on active work"
        ]
      },
      {
        title: "Equipment Emulation",
        description: "Run simulated test suites with device emulation.",
        instructions: [
          "View 6-device emulation model",
          "Monitor Conveyor zones, Sorter, PLC, WMS, and HMI",
          "Start/stop emulation with controls",
          "See real-time status indicators"
        ],
        tips: [
          "Animated model shows device interactions",
          "Useful for testing without physical hardware"
        ]
      }
    ]
  },
  {
    projectId: 22, // AI Code Training Platform
    steps: [
      {
        title: "Challenge Designer",
        description: "Author coding challenges for AI training.",
        instructions: [
          "Create problem statements with constraints",
          "Define input/output examples",
          "Add hidden test cases for validation",
          "Live preview shows formatted problem"
        ],
        tips: [
          "Clear problem statements improve AI understanding",
          "Include edge cases in test scenarios"
        ]
      },
      {
        title: "Challenge Library",
        description: "Browse and select from pre-seeded problems.",
        instructions: [
          "View 8 algorithm problems: Two Sum → Serialize Binary Tree",
          "Filter by difficulty: Easy, Medium, Hard, Expert",
          "One-click load problems into editor",
          "See problem descriptions and constraints"
        ],
        tips: [
          "Start with Easy problems to understand format",
          "Expert problems test advanced concepts"
        ]
      },
      {
        title: "Multi-Language Showcase",
        description: "View solutions in 5 programming languages.",
        instructions: [
          "See 5 algorithms × 5 languages (25 solutions)",
          "Languages: JavaScript, TypeScript, Python, Go, Java",
          "Syntax highlighting with CSS styling",
          "Time/space complexity badges displayed"
        ],
        tips: [
          "Compare approaches across languages",
          "Complexity badges show algorithm efficiency"
        ]
      }
    ]
  },
  {
    projectId: 23, // Fitness Tracker App
    steps: [
      {
        title: "Logging Workouts",
        description: "Track exercise activities with Apple HealthKit and Google Fit.",
        instructions: [
          "Select workout type: Running, Cycling, Swimming, Strength, Yoga, HIIT",
          "Enter duration, distance, and calories burned",
          "Set intensity level for the workout",
          "Data syncs to HealthKit (iOS) or Google Fit (Android)"
        ],
        tips: [
          "Cross-platform React Native with Expo",
          "HealthKit/Google Fit provide seamless data sync"
        ]
      },
      {
        title: "Goal Tracking",
        description: "Set and monitor fitness objectives.",
        instructions: [
          "Create weekly or monthly fitness goals",
          "Track progress toward calorie, distance, or time targets",
          "View completion percentage and streaks",
          "Receive notifications for goal milestones"
        ],
        tips: [
          "Set realistic goals for better motivation",
          "Streaks encourage consistency"
        ]
      },
      {
        title: "Wearable Integration",
        description: "Sync with fitness wearables and smartwatches.",
        instructions: [
          "Connect Apple Watch or Android Wear devices",
          "Automatic workout detection from wearables",
          "Heart rate and step data synchronized",
          "View comprehensive health metrics"
        ],
        tips: [
          "Wearables provide accurate heart rate data",
          "Auto-sync keeps data current"
        ]
      }
    ]
  },
  {
    projectId: 24, // Personal Finance Tracker
    steps: [
      {
        title: "Tracking Transactions",
        description: "Log income and expenses across 8+ categories.",
        instructions: [
          "Add expense or income transactions",
          "Select category: Food, Transport, Bills, Shopping, etc.",
          "Enter amount, date, and optional notes",
          "View transaction history with filters"
        ],
        tips: [
          "Consistent categorization improves insights",
          "Add notes for better context later"
        ]
      },
      {
        title: "Budgeting",
        description: "Set spending limits and track adherence.",
        instructions: [
          "Create monthly budgets by category",
          "Set spending limits for each category",
          "Monitor spending vs. budget progress",
          "Receive alerts when approaching limits"
        ],
        tips: [
          "Review budgets monthly for adjustments",
          "Alerts help prevent overspending"
        ]
      },
      {
        title: "Financial Analytics",
        description: "View spending patterns and fraud detection.",
        instructions: [
          "See pie charts showing spending by category",
          "View monthly trends and comparisons",
          "Fraud detection highlights unusual transactions",
          "Export data for tax preparation"
        ],
        tips: [
          "Analytics reveal spending patterns",
          "Fraud alerts help catch unauthorized charges"
        ]
      }
    ]
  },
  {
    projectId: 25, // Real-time Chat & Messaging App
    steps: [
      {
        title: "Getting Started",
        description: "Join real-time conversations with WebSocket messaging.",
        instructions: [
          "Register or login with JWT authentication",
          "See user presence indicators (online/offline)",
          "Browse available chat rooms or conversations",
          "Socket.IO provides real-time connectivity"
        ],
        tips: [
          "Green dots show online users",
          "WebSocket fallback ensures connectivity"
        ]
      },
      {
        title: "Messaging Features",
        description: "Send messages with reactions and typing indicators.",
        instructions: [
          "Type messages in the input field",
          "See typing indicators when others are writing",
          "React to messages with emoji reactions",
          "Messages appear instantly for all users"
        ],
        tips: [
          "Typing indicators prevent message collisions",
          "Reactions provide quick responses"
        ]
      },
      {
        title: "User Presence",
        description: "Track who's online and active.",
        instructions: [
          "View online status for all contacts",
          "See last active timestamps",
          "Presence updates in real-time",
          "Know when messages are read"
        ],
        tips: [
          "Presence helps coordinate conversations",
          "Cross-platform with Expo support"
        ]
      }
    ]
  },
  {
    projectId: 26, // Real Estate Marketplace App
    steps: [
      {
        title: "Property Search",
        description: "Find properties with advanced filters.",
        instructions: [
          "Search properties by location",
          "Filter by price range and property type",
          "Apply amenity filters: parking, pool, gym, etc.",
          "View property cards with key details"
        ],
        tips: [
          "Multiple filters narrow results effectively",
          "Save searches for quick access"
        ]
      },
      {
        title: "Property Details & Favorites",
        description: "View details and save favorite properties.",
        instructions: [
          "Click properties to see full details",
          "View photos, floor plans, and descriptions",
          "Add to favorites with quick tap",
          "Access favorites list anytime"
        ],
        tips: [
          "Favorites sync across devices",
          "Compare multiple properties easily"
        ]
      },
      {
        title: "Tour Booking",
        description: "Schedule property viewings.",
        instructions: [
          "Select available tour times",
          "Choose in-person or virtual tour",
          "Receive booking confirmation",
          "Manage scheduled tours in profile"
        ],
        tips: [
          "Virtual tours available for many properties",
          "Book multiple tours for same day"
        ]
      }
    ]
  },
  {
    projectId: 27, // Music Streaming App
    steps: [
      {
        title: "Browsing Music",
        description: "Explore playlists, artists, and albums.",
        instructions: [
          "Browse featured playlists on home screen",
          "Search for artists, songs, or albums",
          "View artist profiles and discographies",
          "Mobile-first card design for easy browsing"
        ],
        tips: [
          "Discover Weekly updates every Monday",
          "Save favorite playlists for quick access"
        ]
      },
      {
        title: "Now Playing Controls",
        description: "Control music playback with transport controls.",
        instructions: [
          "Play/pause with center button",
          "Skip forward/backward between tracks",
          "Adjust volume with slider",
          "See album art and track info"
        ],
        tips: [
          "Swipe gestures for quick controls",
          "Background playback supported"
        ]
      },
      {
        title: "Recommendations",
        description: "Discover new music with personalized suggestions.",
        instructions: [
          "View Recently Played section",
          "Check Recommended for You playlists",
          "Explore genre-based recommendations",
          "Build your own playlists"
        ],
        tips: [
          "Recommendations improve with listening history",
          "Create collaborative playlists with friends"
        ]
      }
    ]
  },
  {
    projectId: 28, // Weather Insights App
    steps: [
      {
        title: "Current Conditions",
        description: "View current weather metrics and conditions.",
        instructions: [
          "See current temperature and feels-like temp",
          "Check humidity percentage",
          "View wind speed and direction",
          "Weather icons show current conditions"
        ],
        tips: [
          "Location permission required for local weather",
          "Data updates every 15 minutes"
        ]
      },
      {
        title: "Hourly Forecast",
        description: "Plan your day with 24-hour forecast.",
        instructions: [
          "Scroll through 24-hour forecast strip",
          "See hourly temperature changes",
          "Weather icons show expected conditions",
          "Plan activities around weather"
        ],
        tips: [
          "Swipe left/right to view all hours",
          "Icons indicate rain, clouds, sun, etc."
        ]
      },
      {
        title: "7-Day Outlook",
        description: "View extended forecast with highs and lows.",
        instructions: [
          "See 7-day weather outlook",
          "Daily high and low temperatures",
          "Weather conditions for each day",
          "Plan ahead for week's weather"
        ],
        tips: [
          "Extended forecast helps plan activities",
          "Weather alerts shown when active"
        ]
      }
    ]
  },
  {
    projectId: 29, // ADAS Camera Software Test Dashboard
    steps: [
      {
        title: "Surround-View Monitoring",
        description: "Monitor 5-channel camera system for ADAS ECU.",
        instructions: [
          "View front, rear, left, right, and cargo camera feeds",
          "Animated mock RTSP streams simulate live video",
          "Check resolution and FPS overlays",
          "Verify all camera channels operational"
        ],
        tips: [
          "Each camera shows resolution and frame rate",
          "Green status indicates healthy feed"
        ]
      },
      {
        title: "USS Parking Grid",
        description: "Test 12-sensor ultrasonic parking system.",
        instructions: [
          "View 12 USS sensors arranged around vehicle",
          "Real-time proximity distance animation",
          "Zone coloring: green (clear), yellow (warn), red (critical)",
          "Test parking assist features"
        ],
        tips: [
          "Sensors detect obstacles up to 2.5 meters",
          "Color-coded zones show threat levels"
        ]
      },
      {
        title: "Automated Test Execution",
        description: "Run 80+ test cases across ADAS modules.",
        instructions: [
          "Execute test suites: Camera, USS, Autonomous Driving, Trailer",
          "Monitor live pass/fail/in-progress status",
          "View test case details and results",
          "Check not-executed tests"
        ],
        tips: [
          "80+ test cases cover complete ECU functionality",
          "Status updates in real-time during execution"
        ]
      }
    ]
  },
  {
    projectId: 30, // CAN-FD Network Analyzer & Protocol Decoder
    steps: [
      {
        title: "Frame Trace & Decoding",
        description: "Monitor CAN/CAN-FD frames with DBC signal decoding.",
        instructions: [
          "View scrolling frame trace with timestamps",
          "See message ID, frame type, DLC, and hex data",
          "DBC signals decoded and displayed",
          "Filter frames by ID or message type"
        ],
        tips: [
          "DBC database includes 8 message definitions",
          "Frame trace scrolls automatically"
        ]
      },
      {
        title: "Bus Load & ECU Status",
        description: "Monitor network health and node activity.",
        instructions: [
          "View semicircle bus load gauge",
          "7-second history area chart shows trends",
          "8 ECU node status list with activity indicators",
          "Message frequency table per node"
        ],
        tips: [
          "High bus load (>80%) may indicate issues",
          "Inactive nodes shown with gray status"
        ]
      },
      {
        title: "Signal Plots & Export",
        description: "Visualize signals and export trace data.",
        instructions: [
          "View decoded signals: ENG_Status, VehDynamics, ADAS_Fusion, etc.",
          "Real-time signal value updates",
          "Export trace to Vector ASC format",
          "Compatible with CANalyzer and CANoe"
        ],
        tips: [
          "ASC export enables offline analysis",
          "Signal plots show trends over time"
        ]
      }
    ]
  },
  {
    projectId: 31, // HIL / SiL Automotive Test Platform
    steps: [
      {
        title: "Test Sequence Execution",
        description: "Run automated HIL test sequences.",
        instructions: [
          "Execute 21 test cases across 5 suites",
          "Suites: Camera, USS, ADAS, Trailer, Power/Safety",
          "View per-test progress bars",
          "Monitor test duration and status"
        ],
        tips: [
          "Tests run in sequence automatically",
          "Progress bars show real-time execution"
        ]
      },
      {
        title: "Analog I/O Monitoring",
        description: "Monitor real-time hardware I/O signals.",
        instructions: [
          "View 6 ADC inputs: VBAT, ECU temp, Camera temp, USS Vcc, Brake, Throttle",
          "Monitor 4 DAC outputs: AEB, LKA torque, ACC, Park buzzer",
          "Real-time value updates",
          "Voltage ranges displayed"
        ],
        tips: [
          "ADC inputs simulate sensor readings",
          "DAC outputs control actuators"
        ]
      },
      {
        title: "4-Channel Oscilloscope",
        description: "Visualize signals with scope display.",
        instructions: [
          "View 4-channel oscilloscope canvas",
          "Selectable channels: RPM, Speed, Throttle, Brake",
          "Color-coded signal traces",
          "Trigger line for event capture"
        ],
        tips: [
          "Scope helps debug signal timing",
          "Trigger on rising/falling edges"
        ]
      }
    ]
  },
  {
    projectId: 32, // AUTOSAR ECU Software Component Studio
    steps: [
      {
        title: "SWC Composition Diagram",
        description: "View animated AUTOSAR software component architecture.",
        instructions: [
          "Interactive canvas shows 7 SWCs",
          "Components: CameraAcq, ImgProcessing, ADAS_Fusion, USSManager, etc.",
          "Bezier RTE port arrows show connections",
          "Animated data flow between components"
        ],
        tips: [
          "RTE (Runtime Environment) connects all SWCs",
          "Ports show sender-receiver and client-server interfaces"
        ]
      },
      {
        title: "BSW Stack Visualization",
        description: "Explore AUTOSAR Basic Software layers.",
        instructions: [
          "View 6 BSW layers from MCAL to Application",
          "MCAL: TC399 TriCore drivers",
          "ECU Abstraction, Services (DCM/DEM/NvM), RTE",
          "Application SWCs at top layer"
        ],
        tips: [
          "BSW provides hardware abstraction",
          "Classic AUTOSAR R21-11 architecture"
        ]
      },
      {
        title: "UDS Diagnostics & DTCs",
        description: "Manage diagnostics with ISO 14229 UDS.",
        instructions: [
          "View 8 predefined Diagnostic Trouble Codes",
          "Check freeze-frame data for each DTC",
          "Fault path and severity indicators",
          "MIL (Malfunction Indicator Lamp) status",
          "Clear DTCs with command button"
        ],
        tips: [
          "UDS ISO 14229 is automotive diagnostic standard",
          "Freeze-frame captures conditions when fault occurred"
        ]
      }
    ]
  },
  {
    projectId: 33, // Accessibility QA Engineer – AI Trainer Platform
    steps: [
      {
        title: "WCAG Accessibility Auditor",
        description: "Check color contrast and WCAG 2.1 compliance.",
        instructions: [
          "Enter foreground and background hex colors",
          "Calculate contrast ratio automatically",
          "See AA/AAA pass/fail badges for text sizes",
          "WCAG 2.1 Level AA and AAA compliance checked"
        ],
        tips: [
          "Minimum 4.5:1 for normal text (AA)",
          "7:1 ratio required for AAA compliance"
        ]
      },
      {
        title: "ARIA Validator",
        description: "Validate HTML for proper ARIA usage.",
        instructions: [
          "Paste HTML snippet into validator",
          "Receive parsed ARIA tree structure",
          "See critical/warning/pass issue annotations",
          "Fix ARIA attribute errors"
        ],
        tips: [
          "Proper ARIA improves screen reader support",
          "Fix critical issues first"
        ]
      },
      {
        title: "Keyboard Navigation Tester",
        description: "Audit tab order and keyboard accessibility.",
        instructions: [
          "Test tabindex-ordered focus flow",
          "Visual highlight shows focus order",
          "WCAG 2.4.7 compliance report generated",
          "Identify keyboard trap issues"
        ],
        tips: [
          "All interactive elements must be keyboard accessible",
          "Logical tab order improves usability"
        ]
      }
    ]
  },
  {
    projectId: 34, // Insurance Policy Administration System
    steps: [
      {
        title: "Policy Dashboard",
        description: "View P&C insurance portfolio metrics.",
        instructions: [
          "See KPI cards: total policies, written premium, loss ratio, avg age",
          "Canvas bar chart shows 12-month premium trends",
          "Donut chart displays line-of-business split",
          "Review 8 realistic P&C policies in table"
        ],
        tips: [
          "Policy table shows PolicyNumber, Insured, LOB, Premium",
          "Status badges: Active/Pending/Cancelled"
        ]
      },
      {
        title: "Policy Builder",
        description: "Create new P&C insurance policies.",
        instructions: [
          "Select from all 50 US states",
          "Choose LOB: Auto, Property, General Liability, Workers Comp",
          "Dynamic coverage checkboxes by LOB",
          "Auto: Liability/Collision/Comprehensive",
          "Property: Building/BPP/BI, GL: PremOps/Products, WC: Part A/B"
        ],
        tips: [
          "Coverage options change based on LOB selection",
          "ISO bureau rate engine calculates premium"
        ]
      },
      {
        title: "ACORD Forms & REST API",
        description: "Serialize policies to ACORD XML/JSON.",
        instructions: [
          "Generate ACORD 25 Certificate of Liability",
          "Export policies to XML or JSON format",
          "REST API studio for policy operations",
          "Clean architecture with SOLID principles"
        ],
        tips: [
          "ACORD is insurance industry standard",
          "API supports CRUD operations"
        ]
      }
    ]
  },
  {
    projectId: 35, // CAPL Diagnostics & CAN Verification Demo
    steps: [
      {
        title: "DID Operations",
        description: "Test ReadDataByIdentifier and WriteDataByIdentifier.",
        instructions: [
          "Execute ReadDataByIdentifier for feature calibration",
          "Test WriteDataByIdentifier for status updates",
          "Verify DID responses match specifications",
          "Check data byte formatting"
        ],
        tips: [
          "DIDs provide access to ECU parameters",
          "Common DIDs: VIN, calibration, sensor data"
        ]
      },
      {
        title: "RID Routine Control",
        description: "Simulate routine control operations.",
        instructions: [
          "Start camera self-test routine",
          "Execute trailer alignment assist routine",
          "Check ADAS readiness verification",
          "Monitor routine completion status"
        ],
        tips: [
          "RID routines perform ECU self-tests",
          "Status byte indicates routine progress"
        ]
      },
      {
        title: "DTC Handling",
        description: "Manage Diagnostic Trouble Codes.",
        instructions: [
          "Monitor active DTCs in real-time",
          "Interpret status byte for DTC state",
          "Execute clear DTC command",
          "Re-validate after DTC clear operation"
        ],
        tips: [
          "Status byte: test failed, pending, confirmed, warning",
          "Clear DTCs only after resolving root cause"
        ]
      }
    ]
  },
  {
    projectId: 36, // SAP Test Manager Greenfield Command Center
    steps: [
      {
        title: "Executive Overview",
        description: "Monitor program KPIs and risk metrics.",
        instructions: [
          "View dynamic KPIs for test program health",
          "Check risk index scoring",
          "Review steering-committee narrative generation",
          "Track overall program status"
        ],
        tips: [
          "Red KPIs indicate areas needing attention",
          "Risk index aggregates multiple factors"
        ]
      },
      {
        title: "Test Strategy & Governance",
        description: "Manage test phases and quality gates.",
        instructions: [
          "Edit SIT/E2E/UAT/cutover/hyper-care master plan",
          "Track progress for each test phase",
          "Make quality gate decisions",
          "Adjust timelines and resources"
        ],
        tips: [
          "Quality gates prevent premature phase advancement",
          "Master plan keeps all stakeholders aligned"
        ]
      },
      {
        title: "Defect Control Center",
        description: "Triage and track defects.",
        instructions: [
          "Monitor defects by severity and status",
          "View triage metrics and aging reports",
          "Log new defects with workflow",
          "Track resolution progress"
        ],
        tips: [
          "Severity levels guide prioritization",
          "Defect aging highlights stale issues"
        ]
      }
    ]
  }
];

export function getTutorialForProject(projectId: number): ProjectTutorial | undefined {
  return projectTutorials.find(tutorial => tutorial.projectId === projectId);
}
