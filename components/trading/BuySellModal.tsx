"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils/formatters";
import { StockQuote, User } from "@/types";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface BuySellModalProps {
    quote: StockQuote;
    user: User;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function BuySellModal({ quote, user, isOpen, onClose, onSuccess }: BuySellModalProps) {
    const [shares, setShares] = useState<string>("1");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<"buy" | "sell">("buy");
    const router = useRouter();

    const numShares = parseFloat(shares) || 0;
    const totalCost = numShares * quote.price;

    const handleTransaction = async () => {
        setError("");

        if (numShares <= 0) {
            setError("Please enter a valid number of shares");
            return;
        }

        if (activeTab === "buy" && totalCost > user.virtualBalance) {
            setError("Insufficient funds");
            return;
        }

        setLoading(true);

        try {
            await axios.post("/api/portfolio", {
                userId: user.uid,
                type: activeTab,
                symbol: quote.symbol,
                companyName: quote.companyName,
                shares: numShares,
                price: quote.price,
            });

            if (onSuccess) onSuccess();
            onClose();
            router.refresh();
        } catch (err: any) {
            setError(err.response?.data?.error || "Transaction failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Trade {quote.symbol}</DialogTitle>
                    <DialogDescription>
                        Current Price: {formatCurrency(quote.price)}
                    </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="buy" value={activeTab} onValueChange={(v) => setActiveTab(v as "buy" | "sell")}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="buy">Buy</TabsTrigger>
                        <TabsTrigger value="sell">Sell</TabsTrigger>
                    </TabsList>

                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="shares" className="text-right">
                                Shares
                            </Label>
                            <Input
                                id="shares"
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={shares}
                                onChange={(e) => setShares(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">Total</Label>
                            <div className="col-span-3 font-bold">
                                {formatCurrency(totalCost)}
                            </div>
                        </div>

                        {activeTab === "buy" && (
                            <div className="text-sm text-muted-foreground text-center">
                                Available Cash: {formatCurrency(user.virtualBalance)}
                            </div>
                        )}

                        {error && (
                            <div className="text-sm text-destructive text-center font-medium">
                                {error}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>Cancel</Button>
                        <Button
                            onClick={handleTransaction}
                            disabled={loading || numShares <= 0}
                            variant={activeTab === "buy" ? "default" : "destructive"}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                `${activeTab === "buy" ? "Buy" : "Sell"} ${quote.symbol}`
                            )}
                        </Button>
                    </DialogFooter>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}
