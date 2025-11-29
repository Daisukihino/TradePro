"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StockHolding } from "@/types";
import { formatCurrency } from "@/lib/utils/formatters";

interface PortfolioChartProps {
    holdings: StockHolding[];
    cashBalance: number;
}

export function PortfolioChart({ holdings, cashBalance }: PortfolioChartProps) {
    const data = [
        ...holdings.map((h) => ({
            name: h.symbol,
            value: h.totalValue || 0,
            color: generateColor(h.symbol),
        })),
        {
            name: "Cash",
            value: cashBalance,
            color: "#94a3b8", // slate-400
        },
    ].filter((d) => d.value > 0);

    return (
        <Card className="col-span-1">
            <CardHeader>
                <CardTitle>Allocation</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip
                                formatter={(value: number) => formatCurrency(value)}
                                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                            />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}

// Helper to generate consistent colors based on string
function generateColor(str: string): string {
    const colors = [
        "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6",
        "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}
