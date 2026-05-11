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
    projectId: 10, // Todo App
    steps: [
      {
        title: "Creating Tasks",
        description: "Manage your daily tasks with this simple todo application.",
        instructions: [
          "Type your task in the input field",
          "Press Enter or click 'Add' to create a task",
          "Tasks appear in the list below",
          "Your tasks are automatically saved"
        ],
        tips: [
          "Keep tasks short and specific",
          "Break large projects into smaller tasks"
        ]
      },
      {
        title: "Managing Tasks",
        description: "Complete, edit, and organize your todo items.",
        instructions: [
          "Click the checkbox to mark tasks complete",
          "Click the edit icon to modify a task",
          "Click the delete icon to remove a task",
          "Completed tasks can be filtered from view"
        ],
        tips: [
          "Review your completed tasks for motivation",
          "Delete tasks you no longer need"
        ]
      },
      {
        title: "Filtering & Persistence",
        description: "Filter tasks and rely on local storage.",
        instructions: [
          "Use filter buttons to show All, Active, or Completed",
          "Tasks persist between browser sessions",
          "Data is stored locally on your device",
          "Clear completed tasks with the clear button"
        ],
        tips: [
          "Data is private and stored locally",
          "No account needed - works offline"
        ]
      }
    ]
  },
  {
    projectId: 11, // Weather App
    steps: [
      {
        title: "Checking Weather",
        description: "Get current weather conditions for any location.",
        instructions: [
          "Type a city name in the search box",
          "Press Enter or click the search button",
          "View current temperature and conditions",
          "Weather data updates automatically"
        ],
        tips: [
          "Search by city name or zip code",
          "Works for locations worldwide"
        ]
      },
      {
        title: "Understanding Data",
        description: "Read weather information and forecasts.",
        instructions: [
          "Temperature shown in Fahrenheit or Celsius",
          "Weather conditions displayed with icons",
          "View humidity, wind speed, and pressure",
          "Check the forecast for upcoming days"
        ],
        tips: [
          "Toggle temperature units in settings",
          "Icons represent current conditions"
        ]
      },
      {
        title: "Saved Locations",
        description: "Save your favorite locations for quick access.",
        instructions: [
          "Click the star icon to save a location",
          "Access saved locations from the sidebar",
          "Remove locations by clicking the X",
          "Locations are saved locally"
        ],
        tips: [
          "Save home, work, and travel destinations",
          "Quick access to frequently checked locations"
        ]
      }
    ]
  },
  {
    projectId: 12, // E-commerce Store
    steps: [
      {
        title: "Browsing Products",
        description: "Explore the product catalog and find items.",
        instructions: [
          "Browse products on the homepage",
          "Use category filters to narrow results",
          "Click on products to view details",
          "Read descriptions and specifications"
        ],
        tips: [
          "Use search to find specific items quickly",
          "Filter by category, price, or ratings"
        ]
      },
      {
        title: "Shopping Cart",
        description: "Add items to your cart and manage quantities.",
        instructions: [
          "Click 'Add to Cart' on product pages",
          "View cart by clicking the cart icon",
          "Adjust quantities with +/- buttons",
          "Remove items by clicking the trash icon"
        ],
        tips: [
          "Cart persists across browser sessions",
          "Review cart before checking out"
        ]
      },
      {
        title: "Checkout Process",
        description: "Complete your purchase securely.",
        instructions: [
          "Click 'Checkout' when ready",
          "Enter shipping information",
          "Select payment method",
          "Review order and confirm purchase"
        ],
        tips: [
          "Double-check shipping address",
          "Save addresses for faster future checkouts"
        ]
      }
    ]
  },
  {
    projectId: 13, // Blog Platform
    steps: [
      {
        title: "Reading Posts",
        description: "Browse and read blog articles.",
        instructions: [
          "View latest posts on the homepage",
          "Click post titles to read full articles",
          "Use categories to find specific topics",
          "Search for posts by keyword"
        ],
        tips: [
          "Subscribe to get notified of new posts",
          "Share interesting articles on social media"
        ]
      },
      {
        title: "Creating Content",
        description: "Write and publish your own blog posts.",
        instructions: [
          "Click 'New Post' from the dashboard",
          "Write your article using the rich text editor",
          "Add images and format text",
          "Click 'Publish' to make it live"
        ],
        tips: [
          "Save drafts to continue editing later",
          "Preview posts before publishing"
        ]
      },
      {
        title: "Engagement",
        description: "Interact with readers through comments and likes.",
        instructions: [
          "Enable comments on your posts",
          "Respond to reader comments",
          "View post analytics and likes",
          "Share posts across platforms"
        ],
        tips: [
          "Engage with your audience regularly",
          "Monitor analytics to understand what resonates"
        ]
      }
    ]
  },
  {
    projectId: 14, // Portfolio Website
    steps: [
      {
        title: "Showcase Overview",
        description: "Present your work professionally.",
        instructions: [
          "Homepage displays featured projects",
          "Navigate using the main menu",
          "View about section for background",
          "Contact form for inquiries"
        ],
        tips: [
          "Update regularly with new projects",
          "Highlight your best work first"
        ]
      },
      {
        title: "Project Details",
        description: "Display individual project information.",
        instructions: [
          "Click projects to view full details",
          "Images and descriptions are displayed",
          "Links to live demos and source code",
          "Technology stack clearly listed"
        ],
        tips: [
          "Include high-quality screenshots",
          "Explain your role and contributions"
        ]
      },
      {
        title: "Contact & Social",
        description: "Enable visitors to reach out.",
        instructions: [
          "Contact form sends messages directly",
          "Social media links in footer",
          "Download resume/CV option",
          "Email address visible for direct contact"
        ],
        tips: [
          "Respond promptly to inquiries",
          "Keep contact information current"
        ]
      }
    ]
  },
  {
    projectId: 15, // Chat Application
    steps: [
      {
        title: "Joining Conversations",
        description: "Connect with others in real-time chat.",
        instructions: [
          "Create an account or log in",
          "Browse available chat rooms",
          "Join a room or create your own",
          "Start chatting immediately"
        ],
        tips: [
          "Choose appropriate usernames",
          "Read room rules before posting"
        ]
      },
      {
        title: "Sending Messages",
        description: "Communicate effectively in chat rooms.",
        instructions: [
          "Type messages in the input box",
          "Press Enter to send",
          "Messages appear instantly for all users",
          "Use emoji picker for expressions"
        ],
        tips: [
          "Be respectful to other users",
          "Messages are real-time"
        ]
      },
      {
        title: "Advanced Features",
        description: "Utilize mentions, attachments, and more.",
        instructions: [
          "Type @ to mention specific users",
          "Click attachment icon to share files",
          "React to messages with emoji reactions",
          "View message history by scrolling up"
        ],
        tips: [
          "Mentioned users receive notifications",
          "File size limits may apply"
        ]
      }
    ]
  },
  {
    projectId: 16, // Task Manager
    steps: [
      {
        title: "Creating Projects",
        description: "Organize work into projects and tasks.",
        instructions: [
          "Click 'New Project' to create a project",
          "Give it a name and description",
          "Add team members if collaborative",
          "Projects appear in your sidebar"
        ],
        tips: [
          "Use projects to separate different areas of work",
          "Color-code projects for quick identification"
        ]
      },
      {
        title: "Managing Tasks",
        description: "Break projects down into actionable tasks.",
        instructions: [
          "Add tasks within each project",
          "Set due dates and priorities",
          "Assign tasks to team members",
          "Track task status (To Do, In Progress, Done)"
        ],
        tips: [
          "Use priority levels wisely",
          "Add detailed descriptions to tasks"
        ]
      },
      {
        title: "Collaboration",
        description: "Work together with your team.",
        instructions: [
          "Invite team members via email",
          "Comment on tasks for discussion",
          "Receive notifications for updates",
          "View team member activity"
        ],
        tips: [
          "Clear communication prevents confusion",
          "Regular updates keep everyone informed"
        ]
      }
    ]
  },
  {
    projectId: 17, // Recipe Finder
    steps: [
      {
        title: "Searching Recipes",
        description: "Find recipes based on ingredients or cuisine.",
        instructions: [
          "Enter ingredients you have available",
          "Select cuisine type or dietary preferences",
          "Click search to find matching recipes",
          "Browse through recipe results"
        ],
        tips: [
          "Enter multiple ingredients for better matches",
          "Use filters to refine results"
        ]
      },
      {
        title: "Viewing Recipes",
        description: "Read detailed recipe instructions.",
        instructions: [
          "Click a recipe to view full details",
          "See ingredient list with quantities",
          "Follow step-by-step cooking instructions",
          "View nutritional information"
        ],
        tips: [
          "Check serving sizes and adjust accordingly",
          "Read through all steps before cooking"
        ]
      },
      {
        title: "Saving Favorites",
        description: "Build your personal recipe collection.",
        instructions: [
          "Click the heart icon to save recipes",
          "Access saved recipes from your profile",
          "Create custom collections",
          "Share recipes with friends"
        ],
        tips: [
          "Organize recipes by meal type or occasion",
          "Add personal notes to recipes"
        ]
      }
    ]
  },
  {
    projectId: 18, // Fitness Tracker
    steps: [
      {
        title: "Logging Workouts",
        description: "Track your exercise activities and progress.",
        instructions: [
          "Click 'New Workout' to start logging",
          "Select exercise type (cardio, strength, etc.)",
          "Enter duration, distance, or reps",
          "Save workout to your history"
        ],
        tips: [
          "Log workouts consistently for accurate tracking",
          "Include warm-up and cool-down activities"
        ]
      },
      {
        title: "Setting Goals",
        description: "Define and work toward fitness objectives.",
        instructions: [
          "Navigate to Goals section",
          "Set specific, measurable targets",
          "Choose timeframes for goals",
          "Track progress with visual charts"
        ],
        tips: [
          "Start with achievable goals",
          "Adjust goals as you progress"
        ]
      },
      {
        title: "Viewing Analytics",
        description: "Analyze your fitness data and trends.",
        instructions: [
          "View dashboard for overview statistics",
          "Check weekly and monthly trends",
          "Compare different workout types",
          "Export data for detailed analysis"
        ],
        tips: [
          "Look for patterns in your progress",
          "Use data to adjust your routine"
        ]
      }
    ]
  },
  {
    projectId: 19, // Music Player
    steps: [
      {
        title: "Building Playlists",
        description: "Create and organize your music library.",
        instructions: [
          "Upload or import your music files",
          "Browse your library by artist, album, or song",
          "Create playlists by clicking 'New Playlist'",
          "Drag and drop songs to playlists"
        ],
        tips: [
          "Organize playlists by mood or activity",
          "Use search to find songs quickly"
        ]
      },
      {
        title: "Playback Controls",
        description: "Control music playback with ease.",
        instructions: [
          "Click play/pause button to control playback",
          "Use skip buttons to navigate tracks",
          "Adjust volume with the slider",
          "Enable shuffle or repeat modes"
        ],
        tips: [
          "Keyboard shortcuts available for quick control",
          "Queue songs for continuous playback"
        ]
      },
      {
        title: "Advanced Features",
        description: "Explore equalizer and audio settings.",
        instructions: [
          "Access equalizer for audio customization",
          "Adjust bass, treble, and frequencies",
          "Enable crossfade between tracks",
          "View song lyrics when available"
        ],
        tips: [
          "Experiment with EQ presets",
          "Crossfade creates seamless transitions"
        ]
      }
    ]
  },
  {
    projectId: 20, // Note Taking App
    steps: [
      {
        title: "Creating Notes",
        description: "Capture ideas and information quickly.",
        instructions: [
          "Click 'New Note' to start writing",
          "Give your note a title",
          "Type or paste content in the editor",
          "Notes auto-save as you type"
        ],
        tips: [
          "Use descriptive titles for easy finding",
          "Notes are saved automatically"
        ]
      },
      {
        title: "Formatting & Organization",
        description: "Format text and organize notes effectively.",
        instructions: [
          "Use formatting toolbar for bold, italic, etc.",
          "Create lists and headings",
          "Add tags to categorize notes",
          "Organize notes into folders"
        ],
        tips: [
          "Tags make searching easier",
          "Use folders for different projects"
        ]
      },
      {
        title: "Search & Sync",
        description: "Find notes quickly and keep them synced.",
        instructions: [
          "Use search bar to find notes by keyword",
          "Search looks through titles, content, and tags",
          "Notes sync across devices automatically",
          "Access notes offline when needed"
        ],
        tips: [
          "Full-text search finds anything",
          "Sync keeps your data safe"
        ]
      }
    ]
  },
  {
    projectId: 21, // Budget Tracker
    steps: [
      {
        title: "Adding Transactions",
        description: "Record your income and expenses.",
        instructions: [
          "Click 'Add Transaction' button",
          "Choose income or expense type",
          "Enter amount and category",
          "Add optional notes and save"
        ],
        tips: [
          "Be consistent with categories",
          "Add transactions as they occur"
        ]
      },
      {
        title: "Budget Planning",
        description: "Set spending limits and track adherence.",
        instructions: [
          "Navigate to Budget section",
          "Set monthly limits for each category",
          "View progress bars showing spending",
          "Receive alerts when nearing limits"
        ],
        tips: [
          "Review and adjust budgets monthly",
          "Base budgets on past spending patterns"
        ]
      },
      {
        title: "Reports & Analysis",
        description: "Understand your financial patterns.",
        instructions: [
          "View charts showing spending by category",
          "Check income vs. expenses over time",
          "Identify trends and anomalies",
          "Export reports for tax purposes"
        ],
        tips: [
          "Regular review helps identify savings opportunities",
          "Use reports to make informed financial decisions"
        ]
      }
    ]
  },
  {
    projectId: 22, // Photo Gallery
    steps: [
      {
        title: "Uploading Photos",
        description: "Build your personal photo collection.",
        instructions: [
          "Click 'Upload' button",
          "Select one or multiple photos",
          "Photos are automatically organized by date",
          "Add titles and descriptions"
        ],
        tips: [
          "Upload high-quality originals",
          "Organize photos as you upload"
        ]
      },
      {
        title: "Creating Albums",
        description: "Group related photos into albums.",
        instructions: [
          "Create new album from gallery view",
          "Select photos to add to album",
          "Name and describe your album",
          "Share albums with others"
        ],
        tips: [
          "Albums help organize by event or theme",
          "Set cover photos for albums"
        ]
      },
      {
        title: "Viewing & Sharing",
        description: "Enjoy your photos and share with others.",
        instructions: [
          "Click photos to view full-size",
          "Use arrow keys to navigate",
          "Zoom and pan on photos",
          "Share via link or social media"
        ],
        tips: [
          "Slideshow mode for presentations",
          "Control sharing permissions carefully"
        ]
      }
    ]
  },
  {
    projectId: 23, // Quiz Game
    steps: [
      {
        title: "Starting a Quiz",
        description: "Test your knowledge across various topics.",
        instructions: [
          "Select a quiz category",
          "Choose difficulty level",
          "Click 'Start Quiz' to begin",
          "Read each question carefully"
        ],
        tips: [
          "Start with easier categories",
          "No time limit unless specified"
        ]
      },
      {
        title: "Answering Questions",
        description: "Select answers and progress through the quiz.",
        instructions: [
          "Read the question and all answer options",
          "Click your chosen answer",
          "Immediate feedback shows if correct",
          "Click 'Next' to continue"
        ],
        tips: [
          "Read all options before answering",
          "Incorrect answers show the right one"
        ]
      },
      {
        title: "Scoring & Review",
        description: "View your results and improve.",
        instructions: [
          "Final score shown at quiz end",
          "Review all questions and answers",
          "See which you got right or wrong",
          "Try again to improve your score"
        ],
        tips: [
          "Learn from incorrect answers",
          "Challenge friends to beat your score"
        ]
      }
    ]
  },
  {
    projectId: 24, // Markdown Editor
    steps: [
      {
        title: "Writing Markdown",
        description: "Create formatted documents with simple syntax.",
        instructions: [
          "Type markdown syntax in the left pane",
          "Preview appears live in the right pane",
          "Use # for headings, ** for bold, * for italic",
          "Create lists with - or numbers"
        ],
        tips: [
          "Learn basic markdown syntax quickly",
          "Preview updates as you type"
        ]
      },
      {
        title: "Advanced Formatting",
        description: "Use tables, code blocks, and links.",
        instructions: [
          "Create links: [text](url)",
          "Add images: ![alt](image-url)",
          "Code blocks: wrap in triple backticks",
          "Tables using pipes and dashes"
        ],
        tips: [
          "Syntax highlighting available for code",
          "Tables great for structured data"
        ]
      },
      {
        title: "Exporting Documents",
        description: "Save and share your markdown files.",
        instructions: [
          "Click 'Export' to save as .md file",
          "Export to HTML for web publishing",
          "Copy rendered HTML if needed",
          "Files auto-save locally"
        ],
        tips: [
          "Markdown is portable across platforms",
          "HTML export ready for websites"
        ]
      }
    ]
  },
  {
    projectId: 25, // Drawing App
    steps: [
      {
        title: "Canvas Basics",
        description: "Start creating digital artwork.",
        instructions: [
          "Select brush or pencil tool",
          "Click and drag to draw",
          "Choose colors from the palette",
          "Adjust brush size with slider"
        ],
        tips: [
          "Experiment with different brush sizes",
          "Use color picker for custom colors"
        ]
      },
      {
        title: "Using Tools",
        description: "Explore shapes, eraser, and fill tools.",
        instructions: [
          "Select shape tool for circles, rectangles",
          "Use eraser to remove parts of drawing",
          "Fill tool adds color to enclosed areas",
          "Undo/redo buttons for mistakes"
        ],
        tips: [
          "Hold shift for perfect shapes",
          "Layer tools available for complex art"
        ]
      },
      {
        title: "Saving Your Work",
        description: "Export and share your creations.",
        instructions: [
          "Click 'Save' to download as PNG",
          "Export as JPG or SVG format",
          "Share directly to social media",
          "Clear canvas to start fresh"
        ],
        tips: [
          "PNG preserves transparency",
          "Save frequently to avoid losing work"
        ]
      }
    ]
  },
  {
    projectId: 26, // Code Editor
    steps: [
      {
        title: "Writing Code",
        description: "Professional code editor with syntax highlighting.",
        instructions: [
          "Select programming language from dropdown",
          "Type or paste your code",
          "Syntax highlighting applies automatically",
          "Line numbers displayed for reference"
        ],
        tips: [
          "Supports multiple programming languages",
          "Auto-indentation helps formatting"
        ]
      },
      {
        title: "Code Features",
        description: "Use autocomplete, formatting, and linting.",
        instructions: [
          "Press Ctrl+Space for autocomplete",
          "Format code with Ctrl+Shift+F",
          "Linting highlights errors and warnings",
          "Bracket matching shows pairs"
        ],
        tips: [
          "Autocomplete speeds up coding",
          "Fix linting errors before running"
        ]
      },
      {
        title: "Running & Sharing",
        description: "Execute code and share with others.",
        instructions: [
          "Click 'Run' to execute code",
          "View output in the console panel",
          "Share code via unique link",
          "Download as file for local use"
        ],
        tips: [
          "Console shows errors and output",
          "Shared links preserve code state"
        ]
      }
    ]
  },
  {
    projectId: 27, // Timer App
    steps: [
      {
        title: "Setting Timers",
        description: "Create countdowns for any purpose.",
        instructions: [
          "Enter hours, minutes, and seconds",
          "Click 'Start' to begin countdown",
          "Timer counts down to zero",
          "Sound plays when timer completes"
        ],
        tips: [
          "Use for cooking, studying, or workouts",
          "Multiple timers can run simultaneously"
        ]
      },
      {
        title: "Stopwatch Mode",
        description: "Track elapsed time accurately.",
        instructions: [
          "Switch to Stopwatch tab",
          "Click 'Start' to begin counting up",
          "Use 'Lap' to record split times",
          "Reset or stop as needed"
        ],
        tips: [
          "Lap times recorded with timestamps",
          "Perfect for racing or intervals"
        ]
      },
      {
        title: "Pomodoro Technique",
        description: "Use built-in productivity timer.",
        instructions: [
          "Select Pomodoro mode",
          "Default 25-minute work intervals",
          "Automatic 5-minute break timers",
          "Longer breaks after 4 pomodoros"
        ],
        tips: [
          "Customize interval lengths in settings",
          "Great for focused work sessions"
        ]
      }
    ]
  },
  {
    projectId: 28, // URL Shortener
    steps: [
      {
        title: "Shortening URLs",
        description: "Create short, shareable links.",
        instructions: [
          "Paste long URL into input field",
          "Click 'Shorten' button",
          "Short URL generated instantly",
          "Copy to clipboard with one click"
        ],
        tips: [
          "Works with any valid URL",
          "Short URLs are easier to share"
        ]
      },
      {
        title: "Custom Aliases",
        description: "Create memorable custom short links.",
        instructions: [
          "Enter desired custom alias",
          "Check availability",
          "If available, create custom short URL",
          "Custom links are permanent"
        ],
        tips: [
          "Custom aliases are first-come, first-served",
          "Use brand names or keywords"
        ]
      },
      {
        title: "Analytics",
        description: "Track clicks and link performance.",
        instructions: [
          "View click count for each link",
          "See referrer sources",
          "Check geographic distribution",
          "Monitor trends over time"
        ],
        tips: [
          "Analytics help measure engagement",
          "Data updates in real-time"
        ]
      }
    ]
  },
  {
    projectId: 29, // File Converter
    steps: [
      {
        title: "Uploading Files",
        description: "Convert between various file formats.",
        instructions: [
          "Click 'Choose File' or drag and drop",
          "File type detected automatically",
          "See available conversion options",
          "Select desired output format"
        ],
        tips: [
          "Supports images, documents, audio, video",
          "File size limits may apply"
        ]
      },
      {
        title: "Conversion Options",
        description: "Configure quality and settings.",
        instructions: [
          "Adjust quality slider if applicable",
          "Set resolution for image/video conversion",
          "Choose compression level",
          "Preview settings before converting"
        ],
        tips: [
          "Higher quality = larger file size",
          "Balance quality with file size needs"
        ]
      },
      {
        title: "Downloading Results",
        description: "Get your converted files.",
        instructions: [
          "Click 'Convert' to process",
          "Wait for conversion to complete",
          "Download converted file",
          "Files deleted from server after download"
        ],
        tips: [
          "Conversion time depends on file size",
          "Your files remain private"
        ]
      }
    ]
  },
  {
    projectId: 30, // Crypto Tracker
    steps: [
      {
        title: "Viewing Prices",
        description: "Monitor cryptocurrency market prices.",
        instructions: [
          "Main dashboard shows top cryptocurrencies",
          "Prices update in real-time",
          "View 24h price change percentages",
          "Sort by price, volume, or market cap"
        ],
        tips: [
          "Green indicates price increase",
          "Red indicates price decrease"
        ]
      },
      {
        title: "Adding to Watchlist",
        description: "Track your favorite cryptocurrencies.",
        instructions: [
          "Click star icon to add to watchlist",
          "Watchlist shows your selected coins",
          "Remove items by clicking star again",
          "Watchlist saved to your account"
        ],
        tips: [
          "Focus on coins you're interested in",
          "Receive alerts for price changes"
        ]
      },
      {
        title: "Portfolio Tracking",
        description: "Monitor your crypto investments.",
        instructions: [
          "Add holdings with quantity and purchase price",
          "View total portfolio value",
          "See profit/loss for each holding",
          "Charts show portfolio allocation"
        ],
        tips: [
          "Update holdings as you trade",
          "Track performance over time"
        ]
      }
    ]
  },
  {
    projectId: 31, // QR Code Generator
    steps: [
      {
        title: "Creating QR Codes",
        description: "Generate QR codes for URLs, text, or contacts.",
        instructions: [
          "Select QR code type (URL, text, contact, etc.)",
          "Enter the information to encode",
          "QR code generates instantly",
          "Preview shows how it will scan"
        ],
        tips: [
          "Test QR codes before printing",
          "Ensure data is accurate before generating"
        ]
      },
      {
        title: "Customization",
        description: "Style your QR codes with colors and logos.",
        instructions: [
          "Choose foreground and background colors",
          "Upload logo to embed in center",
          "Adjust error correction level",
          "Maintain scannability while customizing"
        ],
        tips: [
          "High contrast improves scanning",
          "Don't make logos too large"
        ]
      },
      {
        title: "Downloading & Using",
        description: "Export QR codes for various uses.",
        instructions: [
          "Download as PNG, SVG, or PDF",
          "Choose size and resolution",
          "Print for physical use",
          "Include in digital materials"
        ],
        tips: [
          "SVG format scales without quality loss",
          "Test scanning at intended size"
        ]
      }
    ]
  },
  {
    projectId: 32, // Typing Speed Test
    steps: [
      {
        title: "Starting the Test",
        description: "Measure your typing speed and accuracy.",
        instructions: [
          "Click 'Start Test' to begin",
          "Text to type appears on screen",
          "Begin typing in the input area",
          "Timer starts with first keystroke"
        ],
        tips: [
          "Sit with proper posture",
          "Look at the text, not your keyboard"
        ]
      },
      {
        title: "During the Test",
        description: "Type accurately and quickly.",
        instructions: [
          "Type the displayed text exactly",
          "Errors highlighted in red",
          "Backspace to correct mistakes",
          "Timer shows remaining time"
        ],
        tips: [
          "Accuracy is as important as speed",
          "Focus on consistent rhythm"
        ]
      },
      {
        title: "Viewing Results",
        description: "Analyze your typing performance.",
        instructions: [
          "WPM (words per minute) calculated",
          "Accuracy percentage displayed",
          "See corrected vs. uncorrected errors",
          "Track improvement over time"
        ],
        tips: [
          "Practice regularly to improve",
          "Aim for 95%+ accuracy"
        ]
      }
    ]
  },
  {
    projectId: 33, // Expense Splitter
    steps: [
      {
        title: "Creating a Group",
        description: "Split expenses fairly among friends.",
        instructions: [
          "Create a new expense group",
          "Add participants' names",
          "Enter group trip or event name",
          "Invite others to join"
        ],
        tips: [
          "Use for trips, meals, or shared costs",
          "Add everyone before entering expenses"
        ]
      },
      {
        title: "Adding Expenses",
        description: "Record who paid and who owes.",
        instructions: [
          "Click 'Add Expense'",
          "Enter amount and description",
          "Select who paid",
          "Choose who the expense is for"
        ],
        tips: [
          "Split equally or custom amounts",
          "Add expenses as they occur"
        ]
      },
      {
        title: "Settlement",
        description: "See who owes whom and settle up.",
        instructions: [
          "View balance for each person",
          "App calculates optimal settlements",
          "Mark debts as paid when settled",
          "Export summary for record-keeping"
        ],
        tips: [
          "Optimize to minimize transactions",
          "Settle up before trip ends"
        ]
      }
    ]
  },
  {
    projectId: 34, // Flashcard App
    steps: [
      {
        title: "Creating Decks",
        description: "Organize flashcards into study decks.",
        instructions: [
          "Click 'New Deck' to create a collection",
          "Give your deck a name and subject",
          "Add description and tags",
          "Decks appear in your library"
        ],
        tips: [
          "Organize by topic or exam",
          "Keep decks focused on one subject"
        ]
      },
      {
        title: "Making Flashcards",
        description: "Create effective study cards.",
        instructions: [
          "Add cards to your deck",
          "Write question on front",
          "Write answer on back",
          "Add images or formatting if needed"
        ],
        tips: [
          "Keep cards simple and focused",
          "One concept per card works best"
        ]
      },
      {
        title: "Studying",
        description: "Review flashcards and track progress.",
        instructions: [
          "Select deck to study",
          "Click to flip cards",
          "Mark cards as Easy, Good, or Hard",
          "Spaced repetition schedules reviews"
        ],
        tips: [
          "Study regularly for best retention",
          "Honest self-assessment improves learning"
        ]
      }
    ]
  },
  {
    projectId: 35, // Habit Tracker
    steps: [
      {
        title: "Adding Habits",
        description: "Define habits you want to build or track.",
        instructions: [
          "Click 'New Habit' to add one",
          "Name your habit clearly",
          "Set frequency (daily, weekly, etc.)",
          "Choose category and icon"
        ],
        tips: [
          "Start with just a few habits",
          "Make habits specific and measurable"
        ]
      },
      {
        title: "Daily Tracking",
        description: "Log your habit completion each day.",
        instructions: [
          "Check off habits as completed",
          "View today's habits on dashboard",
          "Add notes for context",
          "Streaks tracked automatically"
        ],
        tips: [
          "Log at consistent time each day",
          "Even small progress counts"
        ]
      },
      {
        title: "Progress & Insights",
        description: "Visualize your habit formation.",
        instructions: [
          "View calendar heatmap of completion",
          "See current streaks and records",
          "Check completion percentages",
          "Identify patterns in behavior"
        ],
        tips: [
          "Celebrate milestone streaks",
          "Use data to adjust habits"
        ]
      }
    ]
  },
  {
    projectId: 36, // Snake Game
    steps: [
      {
        title: "Game Basics",
        description: "Classic snake game with modern features.",
        instructions: [
          "Press arrow keys or WASD to move",
          "Eat red food pellets to grow",
          "Avoid hitting walls or yourself",
          "Game speeds up as you score"
        ],
        tips: [
          "Plan your path ahead",
          "Create space to maneuver"
        ]
      },
      {
        title: "Scoring Strategy",
        description: "Maximize your score with smart play.",
        instructions: [
          "Each food pellet increases score",
          "Longer snake = higher score multiplier",
          "Collect special items for bonus points",
          "Survival time adds to score"
        ],
        tips: [
          "Don't chase food into corners",
          "Use edges strategically"
        ]
      },
      {
        title: "Advanced Play",
        description: "Master techniques for high scores.",
        instructions: [
          "Learn to spiral for space management",
          "Use speed boosts wisely",
          "Practice tight maneuvers",
          "Study patterns of successful runs"
        ],
        tips: [
          "Patience often beats speed",
          "Watch replays of top scores"
        ]
      }
    ]
  }
];

export function getTutorialForProject(projectId: number): ProjectTutorial | undefined {
  return projectTutorials.find(tutorial => tutorial.projectId === projectId);
}
