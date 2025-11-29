"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { PriceChart } from "@/components/charts/PriceChart";
import { BuySellModal } from "@/components/trading/BuySellModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockQuote } from "@/types";
import { formatCurrency, formatPercent, formatNumber } from "@/lib/utils/formatters";
import { Loader2, ArrowUpRight, ArrowDownRight, Star, ArrowLeft } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function StockPage({ params }: { params: { symbol: string } }) {
    const { symbol } = params;
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [quote, setQuote] = useState<StockQuote | null>(null);
    const [loading, setLoading] = useState(true);
    const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;

            try {
                // Fetch quote
                const quoteRes = await axios.get(`/api/stocks/quote/${symbol}`);
                setQuote(quoteRes.data.quote);

                // Check watchlist
                const watchlistRes = await axios.get(`/api/watchlist?userId=${user.uid}`);
                const watchlist = watchlistRes.data.watchlist || [];
                setIsInWatchlist(watchlist.some((item: any) => item.symbol === symbol));
            } catch (error) {
                console.error("Error fetching stock data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user, symbol]);

    const toggleWatchlist = async () => {
        if (!user || !quote) return;

        try {
            if (isInWatchlist) {
                await axios.delete(`/api/watchlist?userId=${user.uid}&symbol=${symbol}`);
                setIsInWatchlist(false);
            } else {
                await axios.post("/api/watchlist", {
                    userId: user.uid,
                    symbol: symbol,
                    companyName: quote.companyName,
                });
                setIsInWatchlist(true);
            }
        } catch (error) {
            console.error("Error updating watchlist:", error);
        }
    };

    if (authLoading || (loading && user)) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || !quote) return null;

    const isPositive = quote.change >= 0;

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex flex-1 container px-4 md:px-6 py-6">
                <Sidebar />
                <main className="flex-1 md:pl-6 space-y-6">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-2">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                                {quote.symbol}
                                <span className="text-muted-foreground text-xl font-normal">
                                    {quote.companyName}
                                </span>
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-2xl font-bold">{formatCurrency(quote.price)}</span>
                                <span className={cn(
                                    "flex items-center text-sm font-medium px-2 py-0.5 rounded",
                                    isPositive ? "bg-gain/10 text-gain" : "bg-loss/10 text-loss"
                                )}>
                                    {isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
                                    {formatCurrency(Math.abs(quote.change))} ({formatPercent(Math.abs(quote.changePercent))})
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={toggleWatchlist}>
                                <Star className={cn("mr-2 h-4 w-4", isInWatchlist ? "fill-yellow-400 text-yellow-400" : "")} />
                                {isInWatchlist ? "Watchlisted" : "Watchlist"}
                            </Button>
                            <Button onClick={() => setIsTradeModalOpen(true)}>Trade</Button>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-6">
                            <PriceChart symbol={symbol} color={isPositive ? "#10b981" : "#ef4444"} />
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Key Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-muted-foreground">Open</span>
                                        <span className="font-medium">{formatCurrency(quote.open)}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-muted-foreground">High</span>
                                        <span className="font-medium">{formatCurrency(quote.high)}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-muted-foreground">Low</span>
                                        <span className="font-medium">{formatCurrency(quote.low)}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-muted-foreground">Prev Close</span>
                                        <span className="font-medium">{formatCurrency(quote.previousClose)}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-muted-foreground">Volume</span>
                                        <span className="font-medium">{formatNumber(quote.volume)}</span>
                                    </div>
                                    {quote.marketCap && (
                                        <div className="flex justify-between border-b pb-2">
                                            <span className="text-muted-foreground">Market Cap</span>
                                            <span className="font-medium">{quote.marketCap}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>

            <BuySellModal
                quote={quote}
                user={user}
                isOpen={isTradeModalOpen}
                onClose={() => setIsTradeModalOpen(false)}
                onSuccess={() => {
                    // Refresh user data to update balance
                    router.refresh();
                }}
            />
        </div>
    );
}
