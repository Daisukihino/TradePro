"use client";

import { useEffect, useState } from "react";
import { StockQuote } from "@/types";
import { getStockQuote } from "@/lib/api/stocks";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const WATCH_LIST = ["SM.PH", "BDO.PH", "ALI.PH"];

export function MarketUpdateCard() {
    const [quotes, setQuotes] = useState<StockQuote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const data = await Promise.all(
                    WATCH_LIST.map((symbol) => getStockQuote(symbol))
                );
                setQuotes(data);
            } catch (error) {
                console.error("Failed to fetch market updates", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuotes();
        // Refresh every minute
        const interval = setInterval(fetchQuotes, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="absolute inset-0 p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b pb-4">
                    <div className="space-y-1">
                        <div className="h-4 w-24 bg-muted rounded animate-pulse"></div>
                        <div className="h-8 w-32 bg-primary/20 rounded animate-pulse"></div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse"></div>
                </div>
                <div className="flex-1 bg-muted/50 rounded-lg animate-pulse"></div>
                <div className="grid grid-cols-3 gap-4">
                    <div className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
                    <div className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
                    <div className="h-20 bg-muted/50 rounded-lg animate-pulse"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="absolute inset-0 p-6 flex flex-col gap-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Market Update</h3>
                    <div className="text-2xl font-bold flex items-center gap-2">
                        PSEi <span className="text-sm font-normal text-muted-foreground">(Mock)</span>
                    </div>
                </div>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Activity className="h-5 w-5 text-primary" />
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="space-y-4">
                    {quotes.map((quote) => (
                        <div key={quote.symbol} className="flex items-center justify-between">
                            <div>
                                <div className="font-bold">{quote.symbol}</div>
                                <div className="text-xs text-muted-foreground">{quote.companyName}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-medium">{formatCurrency(quote.price)}</div>
                                <div className={cn(
                                    "text-xs flex items-center justify-end gap-1",
                                    quote.change >= 0 ? "text-green-600" : "text-red-600"
                                )}>
                                    {quote.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                    {formatPercent(quote.changePercent)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-2 border-t">
                <div className="text-xs text-center text-muted-foreground">
                    Real-time data provided by Alpha Vantage
                </div>
            </div>
        </div>
    );
}
