# Personal Finance Dashboard API

A comprehensive RESTful API for personal finance management. Track expenses, set budgets, manage financial goals, and receive fraud alerts.

## 🚀 Features

### Transaction Management
- Log expenses and income by category
- Retrieve transaction history with filtering
- Transaction summaries and analytics
- Full transaction data persistence

### Budget Planning
- Create category-based budgets
- Track spending against budget limits
- Real-time budget status (healthy, warning, exceeded)
- Remaining budget calculations

### Financial Goals
- Create savings goals with target amounts
- Track progress toward goals
- Set deadlines for goal completion
- Multiple concurrent goals support

### Fraud Detection
- Automatic unusual spending alerts
- Flag transactions exceeding 50% of salary
- Alert resolution tracking
- Alert history and status

### Analytics & Insights
- Monthly income and expense breakdowns
- Savings rate calculations
- Category-wise spending analysis
- Balance tracking

## 🛠️ Tech Stack

- **Runtime**: Node.js 14+
- **Framework**: Express.js 4.x
- **Architecture**: RESTful API
- **Data**: In-memory (upgradable to MongoDB/PostgreSQL)
- **CORS**: Enabled for cross-origin requests

## 📦 Installation

```bash
npm install
```

## 🚀 Running the Server

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

Server runs on port `5001` by default.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update profile

### Transactions
- `POST /api/transactions` - Add transaction
- `GET /api/transactions/:userId` - Get transaction history
- `GET /api/summary/:userId` - Get transaction summary

### Budgets
- `POST /api/budgets/:userId` - Create budget
- `GET /api/budgets/:userId` - Get all budgets

### Goals
- `POST /api/goals/:userId` - Create goal
- `GET /api/goals/:userId` - Get all goals

### Fraud Detection
- `GET /api/fraud-alerts/:userId` - Get user alerts
- `POST /api/fraud-alerts/:alertId/resolve` - Resolve alert

### Analytics
- `GET /api/analytics/:userId` - Get dashboard analytics

## 💻 Example Requests

### Register
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "salary": 5000
  }'
```

### Add Transaction
```bash
curl -X POST http://localhost:5001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_1",
    "type": "expense",
    "amount": 50,
    "category": "Food",
    "description": "Lunch at restaurant"
  }'
```

### Create Budget
```bash
curl -X POST http://localhost:5001/api/budgets/user_1 \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Food",
    "limit": 300
  }'
```

## 📊 Database Schema

### User
```javascript
{
  id: String,
  name: String,
  email: String,
  salary: Number,
  currency: String,
  balance: Number,
  createdAt: Date,
  stats: {
    totalSpent: Number,
    totalIncome: Number,
    savingsRate: Number
  }
}
```

### Transaction
```javascript
{
  id: String,
  userId: String,
  type: 'expense' | 'income',
  amount: Number,
  category: String,
  description: String,
  date: Date,
  timestamp: Date,
  status: 'completed'
}
```

### Budget
```javascript
{
  id: String,
  userId: String,
  category: String,
  limit: Number,
  spent: Number,
  period: 'month' | 'week',
  createdAt: Date
}
```

### Goal
```javascript
{
  id: String,
  userId: String,
  name: String,
  targetAmount: Number,
  currentAmount: Number,
  deadline: Date,
  progress: Number,
  createdAt: Date
}
```

## 🔐 Security Considerations

Current Implementation:
- User ID-based authentication
- CORS protection
- Input validation
- Data isolation per user

Production Recommendations:
- Implement JWT tokens
- Add password hashing (bcrypt)
- Enable HTTPS only
- Implement rate limiting
- Add request validation middleware
- Encrypt sensitive data fields
- Implement refresh tokens
- Add 2FA support

## 🚀 Deployment

### Environment Variables
```
PORT=5001
NODE_ENV=production
MONGODB_URI=your_mongodb_uri
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5001
CMD ["npm", "start"]
```

### CI/CD Recommendations
- Lint code (ESLint)
- Run unit tests
- Build Docker image
- Push to container registry
- Deploy to production

## 📈 Future Enhancements

- [ ] Recurring transactions
- [ ] Bill reminders
- [ ] Multi-currency support with conversion
- [ ] Investment tracking
- [ ] Debt management
- [ ] Loan calculator
- [ ] Financial reports (PDF export)
- [ ] Budget forecasting (ML)
- [ ] Expense categorization AI
- [ ] Integration with banking APIs
- [ ] Mobile app notifications
- [ ] Data backup & restore

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📝 License

MIT License

## 👨‍💻 Author

Kevin Douglas Delong
