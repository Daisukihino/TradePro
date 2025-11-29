import { useEffect, useState, useCallback, useRef } from "react";
import { StockQuote } from "@/types";
import { getStockQuote } from "@/lib/api/stocks";

interface UseRealtimeStockOptions {
    symbol: string;
    enabled?: boolean;
    pollingInterval?: number; // milliseconds, default 30000 (30 seconds)
}

interface UseRealtimeStockReturn {
    quote: StockQuote | null;
    loading: boolean;
    error: Error | null;
    lastUpdate: Date | null;
    refresh: () => Promise<void>;
}

/**
 * Custom hook for real-time stock price updates
 * Uses polling to fetch updated prices at regular intervals
 * Can be extended to use WebSocket in the future
 */
export function useRealtimeStock({
    symbol,
    enabled = true,
    pollingInterval = 30000,
}: UseRealtimeStockOptions): UseRealtimeStockReturn {
    const [quote, setQuote] = useState<StockQuote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchQuote = useCallback(async () => {
        if (!symbol || !enabled) return;

        try {
            setError(null);
            const data = await getStockQuote(symbol);
            setQuote(data);
            setLastUpdate(new Date());
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch quote"));
        } finally {
            setLoading(false);
        }
    }, [symbol, enabled]);

    const refresh = useCallback(async () => {
        setLoading(true);
        await fetchQuote();
    }, [fetchQuote]);

    useEffect(() => {
        if (!enabled) {
            setLoading(false);
            return;
        }

        // Initial fetch
        fetchQuote();

        // Set up polling
        intervalRef.current = setInterval(fetchQuote, pollingInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchQuote, pollingInterval, enabled]);

    return {
        quote,
        loading,
        error,
        lastUpdate,
        refresh,
    };
}

/**
 * Hook for managing multiple real-time stock quotes
 */
export function useRealtimeStocks(
    symbols: string[],
    pollingInterval: number = 30000
) {
    const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const fetchQuotes = useCallback(async () => {
        if (symbols.length === 0) return;

        try {
            const results = await Promise.all(
                symbols.map(async (symbol) => {
                    const quote = await getStockQuote(symbol);
                    return { symbol, quote };
                })
            );

            const quotesMap: Record<string, StockQuote> = {};
            results.forEach(({ symbol, quote }) => {
                quotesMap[symbol] = quote;
            });

            setQuotes(quotesMap);
            setLastUpdate(new Date());
        } catch (error) {
            console.error("Error fetching multiple quotes:", error);
        } finally {
            setLoading(false);
        }
    }, [symbols]);

    useEffect(() => {
        if (symbols.length === 0) {
            setLoading(false);
            return;
        }

        // Initial fetch
        fetchQuotes();

        // Set up polling
        intervalRef.current = setInterval(fetchQuotes, pollingInterval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [fetchQuotes, pollingInterval]);

    return {
        quotes,
        loading,
        lastUpdate,
        refresh: fetchQuotes,
    };
}
