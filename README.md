# TradePro - Virtual Stock Trading Platform

A modern web-based virtual stock trading platform featuring **real-time Philippine Stock Exchange (PSE) data**. Practice stock trading with virtual money while tracking actual PSE market prices.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-10.0-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### 🇵🇭 Real Philippine Stock Exchange Data
- Live stock prices from PSE via phisix-api3 API
- Automatic updates every 30 seconds
- Real trading volumes and percent changes
- No API key required for PSE data

### 💰 Virtual Trading
- Start with ₱100,000 virtual cash
- Buy and sell Philippine stocks
- Track portfolio performance
- View transaction history

### 📊 Portfolio Management
- Real-time portfolio valuation
- Holdings with current prices
- Gain/loss tracking
- Interactive charts

### 👀 Watchlist
- Monitor favorite stocks
- Real-time price updates
- Quick access from dashboard

### 📈 Market Data
- Stock price charts
- Historical data visualization
- Market overview
- Top gainers/losers

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Firebase (Authentication & Firestore)
- **Charts**: Recharts
- **Data Source**: PSE API (phisix-api3.appspot.com)

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase account

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Daisukihino/TradePro.git
cd TradePro
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**

Create a `.env.local` file in the root directory:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Optional: Finnhub API for global stocks
NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key
```

4. **Set up Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create a Firestore database
   - Copy your Firebase config to `.env.local`

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
```
http://localhost:3000
```

## 🗄️ Database Structure

### Firestore Collections

**users**
- `uid`: User ID
- `email`: User email
- `displayName`: Display name
- `virtualBalance`: Virtual cash balance
- `createdAt`: Account creation date

**portfolios**
- `userId`: User ID
- `holdings`: Array of stock holdings
- `cashBalance`: Available cash
- `totalValue`: Total portfolio value

**transactions**
- `userId`: User ID
- `type`: "buy" or "sell"
- `symbol`: Stock symbol
- `shares`: Number of shares
- `pricePerShare`: Price per share
- `totalAmount`: Total transaction amount
- `timestamp`: Transaction date

**watchlists**
- `userId`: User ID
- `symbol`: Stock symbol
- `companyName`: Company name
- `addedAt`: Date added

## 📱 Features Overview

### Dashboard
- Portfolio summary
- Total value and gains/losses
- Holdings overview
- Market movers
- Watchlist preview

### Trading
- Search Philippine stocks
- Real-time price quotes
- Buy/sell modal
- Transaction confirmation

### Portfolio
- Detailed holdings table
- Current prices and values
- Gain/loss per stock
- Portfolio chart

### Watchlist
- Add/remove stocks
- Real-time price monitoring
- Quick trading access

### Transactions
- Complete transaction history
- Filter by type
- Export to PDF

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/) components:
- Cards, Buttons, Tables
- Dialogs, Alerts, Skeletons
- Charts (Recharts integration)
- Responsive design
- Dark mode support

## 🔐 Authentication

- Email/Password authentication via Firebase
- Protected routes
- User session management
- Password reset functionality

## 📊 Stock Data

### Philippine Stocks (PSE)
- **Source**: phisix-api3.appspot.com
- **Update**: Market close (3:30 PM PHT)
- **Coverage**: All PSE-listed stocks
- **Cost**: Free

### Global Stocks (Optional)
- **Source**: Finnhub API
- **Requires**: API key (free tier available)
- **Use**: Fallback for non-PSE stocks

## 🚦 Getting Started

1. **Sign up** for a new account
2. **Receive** ₱100,000 virtual cash
3. **Search** for Philippine stocks
4. **Buy** stocks with virtual money
5. **Track** your portfolio performance
6. **Sell** when ready
7. **Learn** stock trading risk-free!

## 📝 Available Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy!

### Other Platforms
- Netlify
- Railway
- Render

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [phisix-api3](https://phisix-api3.appspot.com) for PSE data
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Finnhub](https://finnhub.io) for global stock data
- [Firebase](https://firebase.google.com) for backend services

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Disclaimer**: This is a virtual trading platform for educational purposes only. No real money is involved. Stock prices are real but trading is simulated.
