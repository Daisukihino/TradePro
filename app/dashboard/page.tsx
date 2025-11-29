"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StockSearch } from "@/components/trading/StockSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, TrendingUp, DollarSign, Briefcase, ArrowUpRight, ArrowDownRight, User, LogOut } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";
import { Portfolio, StockQuote } from "@/types";
import axios from "axios";
import { cn } from "@/lib/utils";

// Lazy load StockCard for better performance
const StockCard = dynamic(() => import("@/components/trading/StockCard").then(mod => ({ default: mod.StockCard })), {
    loading: () => <Skeleton className="h-32 w-full" />,
    ssr: false
});

export default function DashboardPage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const router = useRouter();
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [loading, setLoading] = useState(true);
    const [marketMovers, setMarketMovers] = useState<StockQuote[]>([]);
    const [watchlist, setWatchlist] = useState<any[]>([]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                // Fetch portfolio
                const portfolioRes = await axios.get(`/api/portfolio?userId=${user.uid}`);
                setPortfolio(portfolioRes.data.portfolio);

                // Fetch watchlist
                const watchlistRes = await axios.get(`/api/watchlist?userId=${user.uid}`);
                setWatchlist(watchlistRes.data.watchlist || []);

                // Fetch market movers (mocked for now by fetching a few popular stocks)
                const symbols = ["SMPH.PH", "BDO.PH", "ALI.PH", "AC.PH", "JFC.PH"];
                const quoteResults = await Promise.allSettled(
                    symbols.map(async (symbol) => {
                        const res = await axios.get(`/api/stocks/quote/${symbol}`);
                        return res.data.quote;
                    })
                );

                // Extract successful results
                const quotes = quoteResults
                    .filter((result): result is PromiseFulfilledResult<StockQuote> => result.status === "fulfilled")
                    .map(result => result.value);

                setMarketMovers(quotes);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
            // Refresh market movers every 30 seconds for real-time updates
            const interval = setInterval(fetchData, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    if (authLoading || (loading && user)) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 container px-4 md:px-6 py-6">
                <Sidebar />
                <main className="flex-1 md:pl-6 space-y-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                            <p className="text-muted-foreground">
                                Welcome back, {user.displayName || "Trader"}
                            </p>
                        </div>
                        <div className="w-full md:w-auto">
                            <StockSearch />
                        </div>
                    </div>

                    {/* Portfolio Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-3 animate-fadeIn">
                        <Card className="hover-lift transition-smooth">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Portfolio Value
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(portfolio?.totalValue || 0)}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Cash: {formatCurrency(portfolio?.cashBalance || 0)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Gain/Loss
                                </CardTitle>
                                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className={cn(
                                    "text-2xl font-bold",
                                    (portfolio?.totalGainLoss || 0) >= 0 ? "text-gain" : "text-loss"
                                )}>
                                    {formatCurrency(portfolio?.totalGainLoss || 0)}
                                </div>
                                <p className={cn(
                                    "text-xs flex items-center mt-1",
                                    (portfolio?.totalGainLoss || 0) >= 0 ? "text-gain" : "text-loss"
                                )}>
                                    {(portfolio?.totalGainLoss || 0) >= 0 ? (
                                        <ArrowUpRight className="mr-1 h-3 w-3" />
                                    ) : (
                                        <ArrowDownRight className="mr-1 h-3 w-3" />
                                    )}
                                    {formatPercent(portfolio?.totalGainLossPercent || 0)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Holdings
                                </CardTitle>
                                <Briefcase className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {portfolio?.holdings.length || 0}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Active Positions
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Market Overview */}
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                            {marketMovers.map((quote) => (
                                <StockCard key={quote.symbol} quote={quote} />
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity / Holdings Preview */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Top Holdings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {portfolio?.holdings && portfolio.holdings.length > 0 ? (
                                    <div className="space-y-4">
                                        {portfolio.holdings.slice(0, 5).map((holding) => (
                                            <div key={holding.symbol} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="font-medium">{holding.symbol}</p>
                                                    <p className="text-xs text-muted-foreground">{holding.shares} shares</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{formatCurrency(holding.totalValue || 0)}</p>
                                                    <p className={cn(
                                                        "text-xs",
                                                        (holding.gainLoss || 0) >= 0 ? "text-gain" : "text-loss"
                                                    )}>
                                                        {formatPercent(holding.gainLossPercent || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[200px] text-center space-y-4">
                                        <p className="text-muted-foreground">You don&apos;t have any holdings yet.</p>
                                        <Button onClick={() => document.querySelector<HTMLInputElement>('input[type="search"]')?.focus()}>
                                            Start Trading
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Watchlist</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {watchlist && watchlist.length > 0 ? (
                                    <div className="space-y-4">
                                        {watchlist.slice(0, 5).map((item: any) => (
                                            <div key={item.symbol} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                                <div>
                                                    <p className="font-medium">{item.symbol}</p>
                                                    <p className="text-xs text-muted-foreground">{item.companyName}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium">{formatCurrency(item.currentPrice || 0)}</p>
                                                    <p className={cn(
                                                        "text-xs",
                                                        (item.changePercent || 0) >= 0 ? "text-gain" : "text-loss"
                                                    )}>
                                                        {formatPercent(item.changePercent || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-[200px] text-center space-y-4">
                                        <p className="text-muted-foreground">Your watchlist is empty.</p>
                                        <Button variant="outline" onClick={() => router.push('/watchlist')}>
                                            View Watchlist
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}
