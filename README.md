# FinTrack - Personal Finance Tracker

A modern, full-stack personal finance management application built with React, TypeScript, and Express.js. Track your income, expenses, set budgets, and gain insights into your spending habits with beautiful charts and analytics.

## ✨ Features

- **📊 Dashboard Overview**: Get a quick snapshot of your financial health
- **💰 Transaction Management**: Add, edit, and categorize income and expenses
- **📈 Visual Analytics**: Beautiful charts showing spending patterns and category breakdowns
- **🎯 Budget Tracking**: Set and monitor spending limits by category
- **🔐 Secure Authentication**: User authentication with session management
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🔄 Real-time Updates**: Live data updates with React Query
- **📁 Receipt Storage**: Upload and store receipts for transactions

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for modern, responsive styling
- **Radix UI** components for accessible UI elements
- **Recharts** for data visualization
- **React Hook Form** with Zod validation
- **Wouter** for client-side routing

### Backend
- **Express.js** server with TypeScript
- **Drizzle ORM** for database operations
- **PostgreSQL** database (via Neon serverless)
- **Passport.js** for authentication
- **Express Sessions** for session management

### Development Tools
- **TypeScript** for type safety
- **ESBuild** for server bundling
- **Drizzle Kit** for database migrations
- **PostCSS** and **Autoprefixer** for CSS processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon serverless account)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FinTrack
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret_key
   PORT=5000
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5000`

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
FinTrack/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions and configurations
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application component
│   └── index.html
├── server/                # Backend Express server
│   ├── routes.ts         # API route definitions
│   ├── db.ts            # Database connection and setup
│   ├── auth.ts          # Authentication middleware
│   └── index.ts         # Server entry point
├── shared/               # Shared types and schemas
│   └── schema.ts        # Database schema definitions
└── package.json
```

## 🗄️ Database Schema

The application uses the following main entities:

- **Users**: User accounts with authentication
- **Transactions**: Income and expense records
- **Categories**: Transaction categories with colors and icons
- **Budgets**: Spending limits by category and period
- **Sessions**: User session management

## 🔌 API Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout
- `GET /api/transactions` - Fetch user transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/categories` - Fetch transaction categories
- `GET /api/budgets` - Fetch user budgets

## 🎨 UI Components

The application includes a comprehensive set of UI components built with Radix UI primitives:

- **Dashboard Cards**: Financial summary cards
- **Expense Charts**: Visual breakdown of spending
- **Transaction Tables**: Sortable transaction history
- **Add Transaction Modal**: Form for adding new transactions
- **Responsive Navigation**: Mobile-friendly header with user menu

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Husky for git hooks (if configured)

## 🚀 Deployment

The application is designed to work with Replit and can be deployed to various platforms:

1. **Replit**: Clone and run directly
2. **Vercel**: Deploy frontend, configure backend separately
3. **Railway/Heroku**: Deploy full-stack application
4. **Docker**: Containerize the application

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Tailwind CSS](https://tailwindcss.com/) for utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) for type-safe database operations
- [Recharts](https://recharts.org/) for beautiful chart components

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/fintrack/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

**FinTrack** - Take control of your financial future, one transaction at a time! 💰✨
