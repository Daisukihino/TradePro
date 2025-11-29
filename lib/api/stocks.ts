import axios from "axios";
import { StockQuote, ChartDataPoint, StockSearchResult, ChartInterval } from "@/types";

// PSE API Configuration - Philippine Stock Exchange real-time data
const PSE_API_URL = "https://phisix-api3.appspot.com";

// Finnhub API Configuration - For global stocks
const FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY;
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

// Legacy Alpha Vantage (fallback)
const ALPHA_VANTAGE_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY;
const ALPHA_VANTAGE_URL = "https://www.alphavantage.co/query";

// Mock data for fallback when API limit is reached or for development
const MOCK_QUOTE: StockQuote = {
    symbol: "SM.PH",
    companyName: "SM Prime Holdings, Inc.",
    price: 30.50,
    change: 2.5,
    changePercent: 1.69,
    volume: 50000000,
    marketCap: "2.5T",
    high: 151.00,
    low: 149.00,
    open: 149.50,
    previousClose: 147.75,
    timestamp: new Date(),
};

const PH_STOCKS = [
    { symbol: "SMPH.PH", name: "SM Prime Holdings, Inc.", type: "Equity", region: "Manila" },
    { symbol: "BDO.PH", name: "BDO Unibank, Inc.", type: "Equity", region: "Manila" },
    { symbol: "ALI.PH", name: "Ayala Land, Inc.", type: "Equity", region: "Manila" },
    { symbol: "AC.PH", name: "Ayala Corporation", type: "Equity", region: "Manila" },
    { symbol: "JFC.PH", name: "Jollibee Foods Corporation", type: "Equity", region: "Manila" },
    { symbol: "TEL.PH", name: "PLDT Inc.", type: "Equity", region: "Manila" },
    { symbol: "GLO.PH", name: "Globe Telecom, Inc.", type: "Equity", region: "Manila" },
    { symbol: "MER.PH", name: "Manila Electric Company", type: "Equity", region: "Manila" },
    { symbol: "URC.PH", name: "Universal Robina Corporation", type: "Equity", region: "Manila" },
    { symbol: "ICT.PH", name: "International Container Terminal Services, Inc.", type: "Equity", region: "Manila" },
    { symbol: "BPI.PH", name: "Bank of the Philippine Islands", type: "Equity", region: "Manila" },
    { symbol: "MBT.PH", name: "Metropolitan Bank & Trust Company", type: "Equity", region: "Manila" },
    { symbol: "SECB.PH", name: "Security Bank Corporation", type: "Equity", region: "Manila" },
    { symbol: "PGOLD.PH", name: "Puregold Price Club, Inc.", type: "Equity", region: "Manila" },
    { symbol: "CNPF.PH", name: "Century Pacific Food, Inc.", type: "Equity", region: "Manila" },
    { symbol: "SM.PH", name: "SM Investments Corporation", type: "Equity", region: "Manila" },
    { symbol: "MEG.PH", name: "Megaworld Corporation", type: "Equity", region: "Manila" },
];

// Helper function to convert PSE symbol format (.PH suffix) to PSE API format
function toPSESymbol(symbol: string): string {
    // Remove .PH suffix if present
    return symbol.replace('.PH', '');
}

// Helper function to check if a symbol is a Philippine stock
function isPSEStock(symbol: string): boolean {
    return symbol.endsWith('.PH') || PH_STOCKS.some(s => s.symbol === symbol || s.symbol === `${symbol}.PH`);
}

// Fetch stock quote from PSE API
async function getPSEStockQuote(symbol: string): Promise<StockQuote> {
    try {
        const pseSymbol = toPSESymbol(symbol);
        const response = await axios.get(`${PSE_API_URL}/stocks/${pseSymbol}.json`);

        const data = response.data;
        if (data && data.stocks && data.stocks.length > 0) {
            const stock = data.stocks[0];

            // Calculate change and previous close from percent change
            const currentPrice = stock.price.amount;
            const percentChange = stock.percentChange;
            const previousClose = currentPrice / (1 + percentChange / 100);
            const change = currentPrice - previousClose;

            return {
                symbol: symbol.endsWith('.PH') ? symbol : `${symbol}.PH`,
                companyName: stock.name,
                price: currentPrice,
                change: change,
                changePercent: percentChange,
                volume: stock.volume || 0,
                high: currentPrice, // PSE API doesn't provide high/low, use current
                low: currentPrice,
                open: previousClose,
                previousClose: previousClose,
                timestamp: new Date(data.as_of),
            };
        }

        throw new Error(`No data found for ${symbol}`);
    } catch (error) {
        console.error(`Error fetching PSE quote for ${symbol}:`, error);
        throw error;
    }
}

export async function searchStocks(query: string): Promise<StockSearchResult[]> {
    if (!query) return [];

    // Local search for PH stocks - prioritize this for better UX
    const localResults = PH_STOCKS.filter(stock =>
        stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
        stock.name.toLowerCase().includes(query.toLowerCase())
    );

    if (localResults.length > 0) {
        return localResults;
    }

    // Use Finnhub symbol lookup for global stocks
    if (!FINNHUB_API_KEY) {
        console.warn("Finnhub API key not configured");
        return [];
    }

    try {
        const response = await axios.get(`${FINNHUB_BASE_URL}/search`, {
            params: {
                q: query,
                token: FINNHUB_API_KEY,
            },
        });

        if (response.data.result) {
            return response.data.result.slice(0, 10).map((match: any) => ({
                symbol: match.symbol,
                name: match.description,
                type: match.type,
                region: "",
            }));
        }
        return [];
    } catch (error) {
        console.error("Error searching stocks:", error);
        return [];
    }
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
    // Check if this is a Philippine stock - use PSE API
    if (isPSEStock(symbol)) {
        try {
            return await getPSEStockQuote(symbol);
        } catch (error) {
            console.warn(`PSE API failed for ${symbol}, falling back to Finnhub`);
            // Fall through to Finnhub if PSE fails
        }
    }

    // Use Finnhub for global stocks or as fallback
    if (!FINNHUB_API_KEY) {
        console.warn("Finnhub API key not configured, using mock data");
        return { ...MOCK_QUOTE, symbol: symbol, companyName: symbol };
    }

    try {
        // Get real-time quote from Finnhub
        const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, {
            params: {
                symbol: symbol,
                token: FINNHUB_API_KEY,
            },
        });

        const data = response.data;

        // Finnhub returns: c (current), d (change), dp (percent change), h (high), l (low), o (open), pc (previous close)
        if (data && data.c !== undefined && data.c > 0) {
            // Get company name from local PH stocks or use symbol
            const localStock = PH_STOCKS.find(s => s.symbol === symbol);
            const companyName = localStock?.name || symbol;

            return {
                symbol: symbol,
                companyName: companyName,
                price: data.c,
                change: data.d || 0,
                changePercent: data.dp || 0,
                volume: 0, // Finnhub quote doesn't include volume, would need separate call
                high: data.h || data.c,
                low: data.l || data.c,
                open: data.o || data.c,
                previousClose: data.pc || data.c,
                timestamp: new Date(),
            };
        }

        // If no valid data, return mock data
        console.warn(`No valid data for ${symbol}, using mock data`);
        return { ...MOCK_QUOTE, symbol: symbol, companyName: symbol };
    } catch (error) {
        console.error("Error fetching stock quote:", error);
        return { ...MOCK_QUOTE, symbol: symbol, companyName: symbol };
    }
}

export async function getStockChart(
    symbol: string,
    interval: ChartInterval = "1M"
): Promise<ChartDataPoint[]> {
    if (!FINNHUB_API_KEY) {
        console.warn("Finnhub API key not configured, using mock data");
        return generateMockChartData(interval);
    }

    try {
        // Calculate time range based on interval
        const now = Math.floor(Date.now() / 1000);
        let from: number;
        let resolution: string;

        switch (interval) {
            case "1D":
                from = now - 86400; // 1 day
                resolution = "5"; // 5 min candles
                break;
            case "1W":
                from = now - 604800; // 7 days
                resolution = "60"; // 1 hour candles
                break;
            case "1M":
                from = now - 2592000; // 30 days
                resolution = "D"; // Daily candles
                break;
            case "3M":
                from = now - 7776000; // 90 days
                resolution = "D";
                break;
            case "1Y":
                from = now - 31536000; // 365 days
                resolution = "W"; // Weekly candles
                break;
            default:
                from = now - 2592000;
                resolution = "D";
        }

        const response = await axios.get(`${FINNHUB_BASE_URL}/stock/candle`, {
            params: {
                symbol: symbol,
                resolution: resolution,
                from: from,
                to: now,
                token: FINNHUB_API_KEY,
            },
        });

        const data = response.data;

        // Finnhub returns: c (close), h (high), l (low), o (open), t (timestamp), v (volume)
        if (data && data.s === "ok" && data.c && data.t) {
            const dataPoints: ChartDataPoint[] = data.t.map((timestamp: number, index: number) => ({
                timestamp: new Date(timestamp * 1000),
                date: new Date(timestamp * 1000).toISOString().split('T')[0],
                price: data.c[index],
            }));

            return dataPoints;
        }

        // Mock data generation if API fails
        console.warn(`No valid chart data for ${symbol}, using mock data`);
        return generateMockChartData(interval);
    } catch (error) {
        console.error("Error fetching stock chart:", error);
        return generateMockChartData(interval);
    }
}

function generateMockChartData(interval: ChartInterval): ChartDataPoint[] {
    const points: ChartDataPoint[] = [];
    const now = new Date();
    let days = 30;

    if (interval === "1D") days = 1;
    if (interval === "1W") days = 7;
    if (interval === "3M") days = 90;
    if (interval === "1Y") days = 365;

    let price = 150;

    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);

        // Random walk
        price = price + (Math.random() - 0.5) * 5;

        points.push({
            timestamp: date,
            date: date.toISOString().split('T')[0],
            price: Math.max(1, price),
        });
    }

    return points;
}
