import { NextRequest, NextResponse } from "next/server";
import { searchStocks } from "@/lib/api/stocks";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const results = await searchStocks(query);
        return NextResponse.json({ results });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to search stocks" },
            { status: 500 }
        );
    }
}
