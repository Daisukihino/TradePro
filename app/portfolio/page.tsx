"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { HoldingsTable } from "@/components/portfolio/HoldingsTable";
import { PortfolioChart } from "@/components/charts/PortfolioChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils/formatters";
import { exportPortfolioPDF } from "@/lib/utils/exportPDF";
import { Portfolio } from "@/types";
import axios from "axios";
import { cn } from "@/lib/utils";

export default function PortfolioPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!user) return;

            try {
                const response = await axios.get(`/api/portfolio?userId=${user.uid}`);
                setPortfolio(response.data.portfolio);
            } catch (error) {
                console.error("Error fetching portfolio:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPortfolio();
        }
    }, [user]);

    const handleExportPDF = () => {
        if (portfolio && user) {
            exportPortfolioPDF(portfolio, user);
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
                            <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
                            <p className="text-muted-foreground">
                                Manage your holdings and track performance
                            </p>
                        </div>
                        <Button onClick={handleExportPDF} variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export PDF
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Value
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(portfolio?.totalValue || 0)}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Cash Balance
                                </CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(portfolio?.cashBalance || 0)}
                                </div>
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
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2">
                            <Card className="h-full">
                                <CardHeader>
                                    <CardTitle>Holdings</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <HoldingsTable holdings={portfolio?.holdings || []} />
                                </CardContent>
                            </Card>
                        </div>
                        <div>
                            <PortfolioChart
                                holdings={portfolio?.holdings || []}
                                cashBalance={portfolio?.cashBalance || 0}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
