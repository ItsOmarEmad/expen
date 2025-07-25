# AI Financial Tracker

A modern React application for personal financial management with AI-powered insights and recommendations.

## Features

- **Dashboard**: Overview of financial metrics with interactive charts
- **Expense Tracking**: Add and manage expenses by category
- **Goal Setting**: Set and track financial goals with progress visualization
- **Investment Recommendations**: AI-powered investment advice based on your financial situation
- **AI Chat Advisor**: Interactive chat interface for financial questions and advice
- **Smart Alerts**: Automated warnings for spending patterns and savings rates

## Project Structure

```
src/
├── components/          # React components
│   ├── Navigation.tsx   # Tab navigation
│   ├── Dashboard.tsx    # Main dashboard with charts
│   ├── Expenses.tsx     # Expense management
│   ├── Goals.tsx        # Financial goals
│   ├── Investment.tsx   # Investment recommendations
│   ├── Chat.tsx         # AI chat interface
│   └── Alerts.tsx       # Financial alerts
├── context/
│   └── FinancialContext.tsx  # React context for state management
├── types/
│   └── index.ts         # TypeScript interfaces
├── utils/
│   ├── chartData.ts     # Chart data generation utilities
│   └── aiUtils.ts       # AI response and recommendation utilities
├── App.tsx              # Main application component
└── index.tsx            # Application entry point
```

## Technologies Used

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **React Context** for state management

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the development server:

   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Key Components

### FinancialContext

Central state management using React Context API. Manages:

- Current balance and income
- Expenses and goals
- Chat history
- Financial calculations and alerts

### Dashboard

Displays key financial metrics and interactive charts:

- Income vs Spending trends
- Spending by category (pie chart)
- Savings growth projections
- Donation recommendations

### AI Chat Advisor

Interactive chat interface that provides personalized financial advice based on:

- Current financial situation
- Spending patterns
- Income and savings data

## Development

The application follows modern React best practices:

- Functional components with hooks
- TypeScript for type safety
- Component-based architecture
- Separation of concerns with utilities and context
- Responsive design with Tailwind CSS

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.
#   e x p e n  
 