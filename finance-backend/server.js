const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const users = new Map();
const transactions = new Map();
const budgets = new Map();
const goals = new Map();
let userIdCounter = 1;

// Mock fraud alerts
const fraudAlerts = [];

// Categories for transactions
const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Healthcare', 'Education', 'Other'];

function ensureSeedData() {
  if (users.size > 0) {
    return;
  }

  const demoUserId = 'user_demo_finance';
  const demoUser = {
    id: demoUserId,
    name: 'Finance Demo',
    email: 'demo@fintrack.com',
    salary: 6500,
    currency: 'USD',
    balance: 4825,
    createdAt: new Date(),
    stats: {
      totalSpent: 1175,
      totalIncome: 6500,
      averageMonthlySpending: 1175,
      savingsRate: 81.9,
    },
  };

  users.set(demoUserId, demoUser);
  userIdCounter = 2;

  const demoTransactions = [
    { id: 'txn_demo_1', type: 'income', amount: 6500, category: 'Other', description: 'Salary', date: new Date(), timestamp: new Date(), status: 'completed' },
    { id: 'txn_demo_2', type: 'expense', amount: 150, category: 'Food', description: 'Groceries', date: new Date(), timestamp: new Date(), status: 'completed' },
    { id: 'txn_demo_3', type: 'expense', amount: 85, category: 'Transport', description: 'Fuel', date: new Date(), timestamp: new Date(), status: 'completed' },
    { id: 'txn_demo_4', type: 'expense', amount: 940, category: 'Bills', description: 'Rent utilities', date: new Date(), timestamp: new Date(), status: 'completed' },
  ];

  demoTransactions.forEach((txn) => {
    transactions.set(txn.id, {
      ...txn,
      userId: demoUserId,
    });
  });

  budgets.set('budget_demo_1', {
    id: 'budget_demo_1',
    userId: demoUserId,
    category: 'Food',
    limit: 450,
    period: 'month',
    spent: 150,
    createdAt: new Date(),
  });

  goals.set('goal_demo_1', {
    id: 'goal_demo_1',
    userId: demoUserId,
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 2500,
    deadline: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000),
    progress: 25,
    createdAt: new Date(),
  });
}

ensureSeedData();

// Routes

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Finance API is running' });
});

// User Registration
app.post('/api/auth/register', (req, res) => {
  const { name, email, salary, currency = 'USD' } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existing = Array.from(users.values()).find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const userId = `user_${userIdCounter++}`;
  const user = {
    id: userId,
    name,
    email: normalizedEmail,
    salary: salary || 5000,
    currency,
    balance: salary || 5000,
    createdAt: new Date(),
    stats: {
      totalSpent: 0,
      totalIncome: 0,
      averageMonthlySpending: 0,
      savingsRate: 0,
    },
  };

  users.set(userId, user);
  res.status(201).json({ id: userId, user });
});

// User Login
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  
  const user = Array.from(users.values()).find(u => u.email.toLowerCase() === normalizedEmail);
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

  const { salary, currency } = req.body;
  if (salary) user.salary = salary;
  if (currency) user.currency = currency;

  users.set(req.params.userId, user);
  res.json(user);
});

// Add Transaction (Expense/Income)
app.post('/api/transactions', (req, res) => {
  const { userId, type, amount, category, description, date } = req.body;
  
  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const transactionId = `txn_${Date.now()}`;
  const transaction = {
    id: transactionId,
    userId,
    type: type || 'expense', // 'expense' or 'income'
    amount: amount || 0,
    category: category || 'Other',
    description: description || '',
    date: date || new Date(),
    timestamp: new Date(),
    status: 'completed',
  };

  // Update balance
  if (type === 'expense') {
    user.balance -= amount;
    user.stats.totalSpent += amount;
  } else if (type === 'income') {
    user.balance += amount;
    user.stats.totalIncome += amount;
  }

  // Check for fraud (spending more than 50% of balance at once)
  if (type === 'expense' && amount > user.salary * 0.5) {
    fraudAlerts.push({
      id: `alert_${Date.now()}`,
      userId,
      type: 'high_expense',
      message: `Unusual spending detected: $${amount}`,
      amount,
      timestamp: new Date(),
      resolved: false,
    });
  }

  transactions.set(transactionId, transaction);
  users.set(userId, user);

  res.status(201).json(transaction);
});

// Get User Transactions
app.get('/api/transactions/:userId', (req, res) => {
  const { limit = 50, skip = 0, category, type } = req.query;
  
  let userTransactions = Array.from(transactions.values())
    .filter(t => t.userId === req.params.userId);

  if (category) {
    userTransactions = userTransactions.filter(t => t.category === category);
  }
  if (type) {
    userTransactions = userTransactions.filter(t => t.type === type);
  }

  userTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  const total = userTransactions.length;
  const paginated = userTransactions.slice(parseInt(skip), parseInt(skip) + parseInt(limit));

  res.json({ transactions: paginated, total, limit, skip });
});

// Get Transaction Summary
app.get('/api/summary/:userId', (req, res) => {
  const { period = 'month' } = req.query;

  const userTransactions = Array.from(transactions.values())
    .filter(t => t.userId === req.params.userId);

  const byCategory = {};
  let totalIncome = 0;
  let totalExpense = 0;

  userTransactions.forEach(t => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    }
  });

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0;

  res.json({
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    savingsRate: `${savingsRate}%`,
    byCategory,
    transactionCount: userTransactions.length,
  });
});

// Create Budget
app.post('/api/budgets/:userId', (req, res) => {
  const { category, limit, period = 'month' } = req.body;
  
  const user = users.get(req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const budgetId = `budget_${Date.now()}`;
  const budget = {
    id: budgetId,
    userId: req.params.userId,
    category: category || 'Other',
    limit: limit || 0,
    period,
    spent: 0,
    createdAt: new Date(),
  };

  budgets.set(budgetId, budget);
  res.status(201).json(budget);
});

// Get Budgets
app.get('/api/budgets/:userId', (req, res) => {
  const userBudgets = Array.from(budgets.values())
    .filter(b => b.userId === req.params.userId);

  // Calculate spending per budget
  const userTransactions = Array.from(transactions.values())
    .filter(t => t.userId === req.params.userId && t.type === 'expense');

  const enrichedBudgets = userBudgets.map(budget => {
    const spent = userTransactions
      .filter(t => t.category === budget.category)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const percentUsed = budget.limit > 0 ? ((spent / budget.limit) * 100).toFixed(1) : 0;
    const remaining = Math.max(0, budget.limit - spent);

    return {
      ...budget,
      spent,
      remaining,
      percentUsed: `${percentUsed}%`,
      status: percentUsed >= 100 ? 'exceeded' : percentUsed >= 80 ? 'warning' : 'healthy',
    };
  });

  res.json(enrichedBudgets);
});

// Financial Goals
app.post('/api/goals/:userId', (req, res) => {
  const { name, targetAmount, currentAmount = 0, deadline } = req.body;
  
  const goalId = `goal_${Date.now()}`;
  const goal = {
    id: goalId,
    userId: req.params.userId,
    name: name || 'New Goal',
    targetAmount: targetAmount || 0,
    currentAmount: currentAmount || 0,
    deadline: deadline || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    progress: currentAmount / (targetAmount || 1) * 100,
    createdAt: new Date(),
  };

  goals.set(goalId, goal);
  res.status(201).json(goal);
});

// Get Goals
app.get('/api/goals/:userId', (req, res) => {
  const userGoals = Array.from(goals.values())
    .filter(g => g.userId === req.params.userId);

  res.json(userGoals);
});

// Payment Simulation (Stripe-like)
app.post('/api/payments/process', (req, res) => {
  const { userId, amount, cardLast4, description } = req.body;

  const user = users.get(userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (user.balance < amount) {
    return res.status(402).json({ error: 'Insufficient funds' });
  }

  const paymentId = `pay_${Date.now()}`;
  const payment = {
    id: paymentId,
    userId,
    amount,
    cardLast4,
    description,
    status: 'succeeded',
    timestamp: new Date(),
  };

  // Deduct from balance
  user.balance -= amount;
  users.set(userId, user);

  res.status(201).json(payment);
});

// Fraud Alerts
app.get('/api/fraud-alerts/:userId', (req, res) => {
  const userAlerts = fraudAlerts.filter(a => a.userId === req.params.userId);
  res.json(userAlerts);
});

// Resolve Fraud Alert
app.post('/api/fraud-alerts/:alertId/resolve', (req, res) => {
  const alert = fraudAlerts.find(a => a.id === req.params.alertId);
  if (!alert) {
    return res.status(404).json({ error: 'Alert not found' });
  }

  alert.resolved = true;
  res.json(alert);
});

// Analytics Dashboard
app.get('/api/analytics/:userId', (req, res) => {
  const user = users.get(req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const userTransactions = Array.from(transactions.values())
    .filter(t => t.userId === req.params.userId);

  // This month's data
  const thisMonth = new Date();
  const thisMonthTransactions = userTransactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === thisMonth.getMonth() &&
           tDate.getFullYear() === thisMonth.getFullYear();
  });

  const monthlyExpense = thisMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthlyIncome = thisMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // Category breakdown
  const categoryBreakdown = {};
  thisMonthTransactions.forEach(t => {
    if (t.type === 'expense') {
      categoryBreakdown[t.category] = (categoryBreakdown[t.category] || 0) + t.amount;
    }
  });

  res.json({
    balance: user.balance,
    monthlyIncome,
    monthlyExpense,
    savingsThisMonth: monthlyIncome - monthlyExpense,
    savingsRate: monthlyIncome > 0 ? ((monthlyIncome - monthlyExpense) / monthlyIncome * 100).toFixed(1) : 0,
    categoryBreakdown,
    alerts: fraudAlerts.filter(a => a.userId === req.params.userId && !a.resolved).length,
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Finance API running on port ${PORT}`);
});

module.exports = app;
