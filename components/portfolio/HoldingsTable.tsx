"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StockHolding } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface HoldingsTableProps {
    holdings: StockHolding[];
}

export function HoldingsTable({ holdings }: HoldingsTableProps) {
    const router = useRouter();

    if (holdings.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                No holdings found. Start trading to build your portfolio.
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead>Shares</TableHead>
                        <TableHead className="text-right">Avg Price</TableHead>
                        <TableHead className="text-right">Current Price</TableHead>
                        <TableHead className="text-right">Total Value</TableHead>
                        <TableHead className="text-right">Gain/Loss</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {holdings.map((holding) => {
                        const isPositive = (holding.gainLoss || 0) >= 0;
                        return (
                            <TableRow key={holding.symbol}>
                                <TableCell className="font-medium">
                                    <div>{holding.symbol}</div>
                                    <div className="text-xs text-muted-foreground">{holding.companyName}</div>
                                </TableCell>
                                <TableCell>{holding.shares}</TableCell>
                                <TableCell className="text-right">{formatCurrency(holding.avgPurchasePrice)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(holding.currentPrice || 0)}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(holding.totalValue || 0)}</TableCell>
                                <TableCell className="text-right">
                                    <div className={cn("flex items-center justify-end", isPositive ? "text-gain" : "text-loss")}>
                                        {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                        {formatCurrency(holding.gainLoss || 0)}
                                        <span className="ml-1 text-xs">({formatPercent(holding.gainLossPercent || 0)})</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/stock/${holding.symbol}`)}
                                    >
                                        Trade
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
