"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { StockCard } from "@/components/trading/StockCard";
import { StockSearch } from "@/components/trading/StockSearch";
import { Loader2 } from "lucide-react";
import { StockQuote } from "@/types";
import axios from "axios";

export default function MarketPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [marketStocks, setMarketStocks] = useState<StockQuote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchMarketData = async () => {
            if (!user) return;

            try {
                // Fetch a broader list of stocks for the market page
                const symbols = [
                    "SM.PH", "BDO.PH", "ALI.PH", "AC.PH", "JFC.PH",
                    "TEL.PH", "GLO.PH", "MER.PH", "URC.PH", "ICT.PH",
                    "BPI.PH", "MBT.PH", "SECB.PH", "PGOLD.PH", "CNPF.PH"
                ];

                const quotes = await Promise.all(
                    symbols.map(async (symbol) => {
                        try {
                            const res = await axios.get(`/api/stocks/quote/${symbol}`);
                            return res.data.quote;
                        } catch (e) {
                            return null;
                        }
                    })
                );
                setMarketStocks(quotes.filter(q => q !== null) as StockQuote[]);
            } catch (error) {
                console.error("Error fetching market data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMarketData();
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
                            <h1 className="text-3xl font-bold tracking-tight">Market Overview</h1>
                            <p className="text-muted-foreground">
                                Explore top performing stocks and market trends
                            </p>
                        </div>
                        <div className="w-full md:w-auto">
                            <StockSearch />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {marketStocks.map((quote) => (
                            <StockCard key={quote.symbol} quote={quote} />
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
