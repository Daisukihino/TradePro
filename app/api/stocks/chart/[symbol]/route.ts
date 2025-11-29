import { NextRequest, NextResponse } from "next/server";
import { getStockChart } from "@/lib/api/stocks";
import { ChartInterval } from "@/types";

export async function GET(
    request: NextRequest,
    { params }: { params: { symbol: string } }
) {
    const symbol = params.symbol;
    const searchParams = request.nextUrl.searchParams;
    const interval = (searchParams.get("interval") as ChartInterval) || "1M";

    if (!symbol) {
        return NextResponse.json(
            { error: "Symbol is required" },
            { status: 400 }
        );
    }

    try {
        const chartData = await getStockChart(symbol, interval);
        return NextResponse.json({ chartData });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch chart data" },
            { status: 500 }
        );
    }
}
