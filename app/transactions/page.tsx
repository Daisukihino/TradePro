"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { TransactionTable } from "@/components/portfolio/TransactionTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { exportTransactionsPDF } from "@/lib/utils/exportPDF";
import { Transaction } from "@/types";
import axios from "axios";

export default function TransactionsPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!user) return;

            try {
                const response = await axios.get(`/api/transactions?userId=${user.uid}`);
                setTransactions(response.data.transactions);
            } catch (error) {
                console.error("Error fetching transactions:", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTransactions();
        }
    }, [user]);

    const handleExportPDF = () => {
        if (user) {
            exportTransactionsPDF(transactions, user);
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
                            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                            <p className="text-muted-foreground">
                                History of your trading activity
                            </p>
                        </div>
                        <Button onClick={handleExportPDF} variant="outline" className="gap-2">
                            <Download className="h-4 w-4" />
                            Export PDF
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>History</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TransactionTable transactions={transactions} />
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
