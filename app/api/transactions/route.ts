import { NextRequest, NextResponse } from "next/server";
import { getTransactions } from "@/lib/firebase/db";

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
        const transactions = await getTransactions(userId);
        return NextResponse.json({ transactions });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch transactions" },
            { status: 500 }
        );
    }
}
