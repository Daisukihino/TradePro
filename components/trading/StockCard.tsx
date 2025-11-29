"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockQuote } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";

interface StockCardProps {
    quote: StockQuote;
}

export function StockCard({ quote }: StockCardProps) {
    const isPositive = quote.change >= 0;

    return (
        <Link href={`/stock/${quote.symbol}`}>
            <Card className="hover:bg-accent/50 transition-smooth hover-lift cursor-pointer h-full hover:shadow-lg border-l-4 border-l-transparent hover:border-l-primary">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {quote.symbol}
                    </CardTitle>
                    {isPositive ? (
                        <TrendingUp className="h-4 w-4 text-gain" />
                    ) : (
                        <TrendingUp className="h-4 w-4 text-loss transform rotate-180" />
                    )}
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(quote.price)}</div>
                    <p className={cn(
                        "text-xs flex items-center mt-1",
                        isPositive ? "text-gain" : "text-loss"
                    )}>
                        {isPositive ? (
                            <ArrowUpRight className="mr-1 h-3 w-3" />
                        ) : (
                            <ArrowDownRight className="mr-1 h-3 w-3" />
                        )}
                        {formatCurrency(Math.abs(quote.change))} ({formatPercent(Math.abs(quote.changePercent))})
                    </p>
                    <p className="text-xs text-muted-foreground mt-2 truncate">
                        {quote.companyName}
                    </p>
                </CardContent>
            </Card>
        </Link>
    );
}
