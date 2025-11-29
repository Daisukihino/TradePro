import { NextRequest, NextResponse } from "next/server";
import { getStockQuote } from "@/lib/api/stocks";

export async function GET(
    request: NextRequest,
    { params }: { params: { symbol: string } }
) {
    const symbol = params.symbol;

    if (!symbol) {
        return NextResponse.json(
            { error: "Symbol is required" },
            { status: 400 }
        );
    }

    try {
        const quote = await getStockQuote(symbol);
        return NextResponse.json({ quote });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch stock quote" },
            { status: 500 }
        );
    }
}
