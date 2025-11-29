"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StockQuote } from "@/types";
import { getStockQuote } from "@/lib/api/stocks";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";
import { TrendingUp, TrendingDown, Activity, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

// Popular Philippine stocks to display
const FEATURED_STOCKS = [
    "SM.PH",      // SM Investments
    "BDO.PH",     // BDO Unibank
    "ALI.PH",     // Ayala Land
    "AC.PH",      // Ayala Corporation
    "JFC.PH",     // Jollibee Foods
    "MEG.PH",     // Megaworld
    "BPI.PH",     // Bank of the Philippine Islands
    "SMPH.PH",    // SM Prime Holdings
];

function StockPriceCard({ quote, isFlashing }: { quote: StockQuote; isFlashing?: boolean }) {
    const isPositive = quote.change >= 0;

    return (
        <Card className={cn(
            "group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer overflow-hidden",
            isFlashing && "ring-2 ring-primary animate-pulse"
        )}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                            {quote.symbol}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                            {quote.companyName}
                        </p>
                    </div>
                    <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ml-2",
                        isPositive ? "bg-green-500/10" : "bg-red-500/10"
                    )}>
                        {isPositive ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                        )}
                    </div>
                </div>

                <div className="space-y-1">
                    <div className={cn(
                        "text-2xl font-bold transition-all",
                        isFlashing && "text-primary"
                    )}>
                        {formatCurrency(quote.price)}
                    </div>
                    <div className={cn(
                        "text-sm font-medium flex items-center gap-1",
                        isPositive ? "text-green-600" : "text-red-600"
                    )}>
                        <span>{isPositive ? "+" : ""}{formatCurrency(quote.change)}</span>
                        <span>({formatPercent(quote.changePercent)})</span>
                    </div>
                </div>

                {quote.volume && (
                    <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
                        Volume: {quote.volume.toLocaleString()}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function StockPriceSkeleton() {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-20" />
            </CardContent>
        </Card>
    );
}

export function LiveStockPrices() {
    const [quotes, setQuotes] = useState<StockQuote[]>([]);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const [flashingSymbols, setFlashingSymbols] = useState<Set<string>>(new Set());

    const fetchQuotes = async () => {
        try {
            const data = await Promise.all(
                FEATURED_STOCKS.map((symbol) => getStockQuote(symbol))
            );

            // Detect price changes for flash animation
            const newFlashing = new Set<string>();
            data.forEach((newQuote, index) => {
                const oldQuote = quotes[index];
                if (oldQuote && oldQuote.price !== newQuote.price) {
                    newFlashing.add(newQuote.symbol);
                }
            });

            setQuotes(data);
            setLastUpdate(new Date());
            setFlashingSymbols(newFlashing);

            // Clear flash animation after 1 second
            if (newFlashing.size > 0) {
                setTimeout(() => setFlashingSymbols(new Set()), 1000);
            }
        } catch (error) {
            console.error("Failed to fetch stock prices", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotes();
        // Refresh every 30 seconds for real-time updates
        const interval = setInterval(fetchQuotes, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="w-full py-20 md:py-32 bg-muted/30">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold bg-green-500/10 text-green-600 border-green-500/20">
                        <Activity className="h-4 w-4 animate-pulse" />
                        Live Prices • Updates every 30s
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Philippine Stock Prices
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-lg">
                        Real-time prices for top Philippine stocks from the PSE
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <RefreshCw className="h-3 w-3" />
                        <span>Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : "Loading..."}</span>
                    </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                    {loading ? (
                        <>
                            {FEATURED_STOCKS.map((symbol) => (
                                <StockPriceSkeleton key={symbol} />
                            ))}
                        </>
                    ) : (
                        <>
                            {quotes.map((quote) => (
                                <StockPriceCard
                                    key={quote.symbol}
                                    quote={quote}
                                    isFlashing={flashingSymbols.has(quote.symbol)}
                                />
                            ))}
                        </>
                    )}
                </div>

                <div className="mt-8 text-center">
                    <p className="text-xs text-muted-foreground">
                        Philippine Stock Exchange (PSE) data • Updates every 30 seconds • Prices as of latest trading day
                    </p>
                </div>
            </div>
        </section>
    );
}
