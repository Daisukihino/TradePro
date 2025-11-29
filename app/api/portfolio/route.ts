import { NextRequest, NextResponse } from "next/server";
import { getPortfolio, updatePortfolio, addTransaction, updateVirtualBalance } from "@/lib/firebase/db";
import { getStockQuote } from "@/lib/api/stocks";
import { StockHolding, Transaction } from "@/types";

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
        const portfolio = await getPortfolio(userId);

        if (!portfolio) {
            return NextResponse.json({ portfolio: null });
        }

        // Update current prices for all holdings
        const updatedHoldings = await Promise.all(
            portfolio.holdings.map(async (holding) => {
                try {
                    const quote = await getStockQuote(holding.symbol);
                    const currentPrice = quote.price;
                    const totalValue = currentPrice * holding.shares;
                    const gainLoss = totalValue - (holding.avgPurchasePrice * holding.shares);
                    const gainLossPercent = ((currentPrice - holding.avgPurchasePrice) / holding.avgPurchasePrice) * 100;

                    return {
                        ...holding,
                        currentPrice,
                        totalValue,
                        gainLoss,
                        gainLossPercent,
                    };
                } catch (error) {
                    // If fetching quote fails, return holding as is
                    return holding;
                }
            })
        );

        // Calculate total portfolio value
        const holdingsValue = updatedHoldings.reduce(
            (sum, holding) => sum + (holding.totalValue || 0),
            0
        );

        const totalValue = holdingsValue + portfolio.cashBalance;
        const totalGainLoss = updatedHoldings.reduce(
            (sum, holding) => sum + (holding.gainLoss || 0),
            0
        );

        // Calculate total gain/loss percent based on initial investment vs current value
        // This is a simplified calculation
        const totalCostBasis = updatedHoldings.reduce(
            (sum, holding) => sum + (holding.avgPurchasePrice * holding.shares),
            0
        );

        const totalGainLossPercent = totalCostBasis > 0
            ? (totalGainLoss / totalCostBasis) * 100
            : 0;

        const updatedPortfolio = {
            ...portfolio,
            holdings: updatedHoldings,
            totalValue,
            totalGainLoss,
            totalGainLossPercent,
        };

        return NextResponse.json({ portfolio: updatedPortfolio });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch portfolio" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, type, symbol, companyName, shares, price } = body;

        if (!userId || !type || !symbol || !shares || !price) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const portfolio = await getPortfolio(userId);
        if (!portfolio) {
            return NextResponse.json(
                { error: "Portfolio not found" },
                { status: 404 }
            );
        }

        const totalAmount = shares * price;
        let newHoldings = [...portfolio.holdings];
        let newCashBalance = portfolio.cashBalance;

        if (type === "buy") {
            if (portfolio.cashBalance < totalAmount) {
                return NextResponse.json(
                    { error: "Insufficient funds" },
                    { status: 400 }
                );
            }

            newCashBalance -= totalAmount;

            const existingHoldingIndex = newHoldings.findIndex(h => h.symbol === symbol);

            if (existingHoldingIndex >= 0) {
                const holding = newHoldings[existingHoldingIndex];
                const totalShares = holding.shares + shares;
                const totalCost = (holding.shares * holding.avgPurchasePrice) + totalAmount;
                const newAvgPrice = totalCost / totalShares;

                newHoldings[existingHoldingIndex] = {
                    ...holding,
                    shares: totalShares,
                    avgPurchasePrice: newAvgPrice,
                };
            } else {
                newHoldings.push({
                    symbol,
                    companyName,
                    shares,
                    avgPurchasePrice: price,
                    currentPrice: price,
                    totalValue: totalAmount,
                    gainLoss: 0,
                    gainLossPercent: 0,
                });
            }
        } else if (type === "sell") {
            const existingHoldingIndex = newHoldings.findIndex(h => h.symbol === symbol);

            if (existingHoldingIndex === -1 || newHoldings[existingHoldingIndex].shares < shares) {
                return NextResponse.json(
                    { error: "Insufficient shares" },
                    { status: 400 }
                );
            }

            newCashBalance += totalAmount;
            const holding = newHoldings[existingHoldingIndex];

            if (holding.shares === shares) {
                newHoldings.splice(existingHoldingIndex, 1);
            } else {
                newHoldings[existingHoldingIndex] = {
                    ...holding,
                    shares: holding.shares - shares,
                };
            }
        } else {
            return NextResponse.json(
                { error: "Invalid transaction type" },
                { status: 400 }
            );
        }

        // Update portfolio in DB
        await updatePortfolio(userId, newHoldings);
        await updateVirtualBalance(userId, type === "buy" ? -totalAmount : totalAmount);

        // Record transaction
        const transaction: Omit<Transaction, "id"> = {
            userId,
            type,
            symbol,
            companyName,
            shares,
            pricePerShare: price,
            totalAmount,
            timestamp: new Date(),
        };

        await addTransaction(transaction);

        return NextResponse.json({ success: true, newBalance: newCashBalance });
    } catch (error) {
        console.error("Transaction error:", error);
        return NextResponse.json(
            { error: "Transaction failed" },
            { status: 500 }
        );
    }
}
