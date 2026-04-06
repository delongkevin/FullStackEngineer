const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (for demo purposes)
const users = new Map();
const workouts = new Map();
let userIdCounter = 1;

// Mock HealthKit/Google Fit integration data
const healthKitData = {
  heartRate: [72, 75, 78, 80, 82, 81, 79],
  steps: [8432, 9123, 12045, 10234, 15432, 11023, 9876],
  calories: [1850, 1920, 2150, 1980, 2340, 1890, 1765],
  water: [2.1, 1.8, 2.5, 2.0, 2.3, 1.9, 2.2],
  sleep: [7.2, 6.8, 8.1, 7.5, 8.3, 7.1, 7.6]
};

// Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Fitness Tracker API is running' });
});

// User Registration
app.post('/api/auth/register', (req, res) => {
  const { name, email, age, weight, height, goal } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  const userId = `user_${userIdCounter++}`;
  const user = {
    id: userId,
    name,
    email,
    age: age || 25,
    weight: weight || 70,
    height: height || 175,
    goal: goal || 'maintain',
    joinedDate: new Date(),
    stats: {
      totalWorkouts: 0,
      totalCalories: 0,
      totalDistance: 0,
      bestStreak: 0,
      currentStreak: 0
    }
  };

  users.set(userId, user);
  res.status(201).json({ id: userId, user });
});

// User Login
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  
  const user = Array.from(users.values()).find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  res.json({ id: user.id, user });
});

// Get User Profile
app.get('/api/users/:userId', (req, res) => {
  const user = users.get(req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Update User Profile
app.put('/api/users/:userId', (req, res) => {
  const user = users.get(req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { weight, height, goal } = req.body;
  if (weight) user.weight = weight;
  if (height) user.height = height;
  if (goal) user.goal = goal;

  users.set(req.params.userId, user);
  res.json(user);
});

// Log Workout
app.post('/api/workouts', (req, res) => {
  const { userId, type, duration, distance, calories, intensity, notes, date } = req.body;
  
  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const workoutId = `workout_${Date.now()}`;
  const workout = {
    id: workoutId,
    userId,
    type: type || 'running',
    duration: duration || 30,
    distance: distance || 5.0,
    calories: calories || 300,
    intensity: intensity || 'moderate',
    notes: notes || '',
    date: date || new Date(),
    timestamp: new Date()
  };

  workouts.set(workoutId, workout);
  
  // Update user stats
  user.stats.totalWorkouts += 1;
  user.stats.totalCalories += calories || 300;
  user.stats.totalDistance += distance || 5.0;
  users.set(userId, user);

  res.status(201).json(workout);
});

// Get User Workouts
app.get('/api/workouts/:userId', (req, res) => {
  const userWorkouts = Array.from(workouts.values())
    .filter(w => w.userId === req.params.userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  res.json(userWorkouts);
});

// Get Weekly Summary
app.get('/api/summary/:userId/weekly', (req, res) => {
  const userWorkouts = Array.from(workouts.values())
    .filter(w => w.userId === req.params.userId);

  const lastWeek = userWorkouts.filter(w => {
    const date = new Date(w.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return date >= weekAgo;
  });

  const summary = {
    workoutsCompleted: lastWeek.length,
    totalCalories: lastWeek.reduce((sum, w) => sum + w.calories, 0),
    totalDistance: lastWeek.reduce((sum, w) => sum + w.distance, 0),
    avgDuration: lastWeek.length > 0 ? Math.round(lastWeek.reduce((sum, w) => sum + w.duration, 0) / lastWeek.length) : 0,
    workoutsByType: {}
  };

  lastWeek.forEach(w => {
    summary.workoutsByType[w.type] = (summary.workoutsByType[w.type] || 0) + 1;
  });

  res.json(summary);
});

// HealthKit/Google Fit Mock Integration
app.get('/api/healthkit/:userId', (req, res) => {
  const { metric = 'all' } = req.query;

  if (metric === 'all') {
    res.json({
      heartRate: {
        today: healthKitData.heartRate[6],
        average: Math.round(healthKitData.heartRate.reduce((a, b) => a + b) / healthKitData.heartRate.length),
        data: healthKitData.heartRate
      },
      steps: {
        today: healthKitData.steps[6],
        goal: 10000,
        data: healthKitData.steps
      },
      calories: {
        today: healthKitData.calories[6],
        goal: 2000,
        data: healthKitData.calories
      },
      water: {
        today: healthKitData.water[6],
        goal: 2.5,
        data: healthKitData.water
      },
      sleep: {
        today: healthKitData.sleep[6],
        goal: 8,
        recommendation: 'Get a full 8 hours for optimal muscle recovery',
        data: healthKitData.sleep
      }
    });
  } else {
    res.json({ [metric]: healthKitData[metric] || [] });
  }
});

// Wearable Integration Status
app.get('/api/wearables/:userId', (req, res) => {
  res.json({
    devices: [
      {
        id: 'applewatch_1',
        name: 'Apple Watch Series 8',
        type: 'smartwatch',
        platform: 'iOS',
        connected: true,
        lastSync: new Date(Date.now() - 5 * 60000) // 5 minutes ago
      },
      {
        id: 'wear_os_1',
        name: 'Samsung Galaxy Watch 5',
        type: 'smartwatch',
        platform: 'Android',
        connected: true,
        lastSync: new Date(Date.now() - 10 * 60000) // 10 minutes ago
      },
      {
        id: 'fitbit_1',
        name: 'Fitbit Charge 5',
        type: 'fitness_band',
        platform: 'Cross-platform',
        connected: false,
        lastSync: new Date(Date.now() - 2 * 60 * 60000) // 2 hours ago
      }
    ]
  });
});

// Goals Management
app.post('/api/goals/:userId', (req, res) => {
  const { name, target, type, deadline } = req.body;
  const goalId = `goal_${Date.now()}`;
  
  const goal = {
    id: goalId,
    userId: req.params.userId,
    name: name || 'New Goal',
    target: target || 10000,
    type: type || 'steps',
    deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    progress: 0,
    created: new Date()
  };

  res.status(201).json(goal);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Fitness Tracker API running on port ${PORT}`);
});

module.exports = app;
