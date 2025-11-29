import { StockHolding } from "@/types";

export function calculateGainLoss(
    currentPrice: number,
    avgPrice: number,
    shares: number
): number {
    return (currentPrice - avgPrice) * shares;
}

export function calculateGainLossPercent(
    currentPrice: number,
    avgPrice: number
): number {
    if (avgPrice === 0) return 0;
    return ((currentPrice - avgPrice) / avgPrice) * 100;
}

export function calculatePortfolioValue(
    holdings: StockHolding[],
    cashBalance: number
): number {
    const holdingsValue = holdings.reduce((sum, holding) => {
        return sum + (holding.currentPrice || holding.avgPurchasePrice) * holding.shares;
    }, 0);

    return holdingsValue + cashBalance;
}

export function calculateNewAvgPrice(
    currentAvg: number,
    currentShares: number,
    newShares: number,
    newPrice: number
): number {
    const totalCost = (currentAvg * currentShares) + (newPrice * newShares);
    const totalShares = currentShares + newShares;

    if (totalShares === 0) return 0;
    return totalCost / totalShares;
}
