"use client";

import { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { ChartDataPoint, ChartInterval } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/formatters";
import { Loader2 } from "lucide-react";
import axios from "axios";

interface PriceChartProps {
    symbol: string;
    color?: string;
}

export function PriceChart({ symbol, color = "#10b981" }: PriceChartProps) {
    const [data, setData] = useState<ChartDataPoint[]>([]);
    const [interval, setInterval] = useState<ChartInterval>("1M");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChartData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/stocks/chart/${symbol}?interval=${interval}`);
                setData(response.data.chartData);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [symbol, interval]);

    const intervals: ChartInterval[] = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-normal">Price History</CardTitle>
                <div className="flex space-x-1">
                    {intervals.map((i) => (
                        <Button
                            key={i}
                            variant={interval === i ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setInterval(i)}
                            className="h-7 px-2 text-xs"
                        >
                            {i}
                        </Button>
                    ))}
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full mt-4">
                    {loading ? (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data}>
                                <defs>
                                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    minTickGap={30}
                                />
                                <YAxis
                                    domain={['auto', 'auto']}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(val) => `$${val}`}
                                    tickLine={false}
                                    axisLine={false}
                                    width={60}
                                />
                                <Tooltip
                                    formatter={(value: number) => [formatCurrency(value), "Price"]}
                                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="price"
                                    stroke={color}
                                    fillOpacity={1}
                                    fill="url(#colorPrice)"
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
