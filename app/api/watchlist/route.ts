import { NextRequest, NextResponse } from "next/server";
import { getWatchlist, addToWatchlist, removeFromWatchlist } from "@/lib/firebase/db";
import { getStockQuote } from "@/lib/api/stocks";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json(
            { error: "User ID is required" },
            { status: 400 }
        );
    }

    try {
        const watchlist = await getWatchlist(userId);

        // Update current prices for all watchlist items
        const updatedWatchlist = await Promise.all(
            watchlist.map(async (item) => {
                try {
                    const quote = await getStockQuote(item.symbol);
                    return {
                        ...item,
                        currentPrice: quote.price,
                        change: quote.change,
                        changePercent: quote.changePercent,
                    };
                } catch (error) {
                    return item;
                }
            })
        );

        return NextResponse.json({ watchlist: updatedWatchlist });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch watchlist" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, symbol, companyName } = body;

        if (!userId || !symbol || !companyName) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await addToWatchlist(userId, symbol, companyName);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to add to watchlist" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const symbol = searchParams.get("symbol");

    if (!userId || !symbol) {
        return NextResponse.json(
            { error: "User ID and Symbol are required" },
            { status: 400 }
        );
    }

    try {
        await removeFromWatchlist(userId, symbol);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to remove from watchlist" },
            { status: 500 }
        );
    }
}
