// User types
export interface User {
    uid: string;
    email: string;
    displayName: string | null;
    createdAt: Date;
    virtualBalance: number;
}

// Stock holding in portfolio
export interface StockHolding {
    symbol: string;
    companyName: string;
    shares: number;
    avgPurchasePrice: number;
    currentPrice?: number;
    totalValue?: number;
    gainLoss?: number;
    gainLossPercent?: number;
}

// Portfolio
export interface Portfolio {
    userId: string;
    holdings: StockHolding[];
    totalValue: number;
    cashBalance: number;
    totalGainLoss: number;
    totalGainLossPercent: number;
}

// Transaction
export interface Transaction {
    id: string;
    userId: string;
    type: "buy" | "sell";
    symbol: string;
    companyName: string;
    shares: number;
    pricePerShare: number;
    totalAmount: number;
    timestamp: Date;
}

// Watchlist item
export interface WatchlistItem {
    userId: string;
    symbol: string;
    companyName: string;
    addedAt: Date;
    currentPrice?: number;
    change?: number;
    changePercent?: number;
}

// Stock quote from API
export interface StockQuote {
    symbol: string;
    companyName: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: string;
    high: number;
    low: number;
    open: number;
    previousClose: number;
    timestamp: Date;
}

// Chart data point
export interface ChartDataPoint {
    timestamp: Date;
    price: number;
    date?: string; // formatted date for display
}

// Stock search result
export interface StockSearchResult {
    symbol: string;
    name: string;
    type: string;
    region: string;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Chart interval options
export type ChartInterval = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y";

// Transaction type
export type TransactionType = "buy" | "sell";
