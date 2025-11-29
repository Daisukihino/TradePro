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
import { WatchlistItem } from "@/types";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import axios from "axios";

interface WatchlistTableProps {
    watchlist: WatchlistItem[];
    onRemove: (symbol: string) => void;
}

export function WatchlistTable({ watchlist, onRemove }: WatchlistTableProps) {
    const router = useRouter();

    if (watchlist.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground">
                Your watchlist is empty. Search for stocks to add them.
            </div>
        );
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Symbol</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Change</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {watchlist.map((item) => {
                        const isPositive = (item.change || 0) >= 0;
                        return (
                            <TableRow key={item.symbol}>
                                <TableCell className="font-medium">
                                    <div>{item.symbol}</div>
                                    <div className="text-xs text-muted-foreground">{item.companyName}</div>
                                </TableCell>
                                <TableCell className="text-right">{formatCurrency(item.currentPrice || 0)}</TableCell>
                                <TableCell className="text-right">
                                    <div className={cn("flex items-center justify-end", isPositive ? "text-gain" : "text-loss")}>
                                        {isPositive ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                                        {formatCurrency(Math.abs(item.change || 0))}
                                        <span className="ml-1 text-xs">({formatPercent(Math.abs(item.changePercent || 0))})</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => router.push(`/stock/${item.symbol}`)}
                                        >
                                            Trade
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                            onClick={() => onRemove(item.symbol)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
