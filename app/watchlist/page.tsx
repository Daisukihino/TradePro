"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { WatchlistTable } from "@/components/watchlist/WatchlistTable";
import { StockSearch } from "@/components/trading/StockSearch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { WatchlistItem } from "@/types";
import axios from "axios";

export default function WatchlistPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchWatchlist = async () => {
            if (!user) return;

            try {
                const response = await axios.get(`/api/watchlist?userId=${user.uid}`);
                setWatchlist(response.data.watchlist);
            } catch (error) {
                console.error("Error fetching watchlist:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchWatchlist();
        }
    }, [user]);

    const handleRemove = async (symbol: string) => {
        if (!user) return;

        try {
            await axios.delete(`/api/watchlist?userId=${user.uid}&symbol=${symbol}`);
            // Optimistic update
            setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
        } catch (error) {
            console.error("Error removing from watchlist:", error);
        }
    };

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
                            <h1 className="text-3xl font-bold tracking-tight">Watchlist</h1>
                            <p className="text-muted-foreground">
                                Track your favorite stocks
                            </p>
                        </div>
                        <div className="w-full md:w-auto">
                            <StockSearch />
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Your Watchlist</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <WatchlistTable watchlist={watchlist} onRemove={handleRemove} />
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
