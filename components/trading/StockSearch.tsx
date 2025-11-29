"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { StockSearchResult } from "@/types";
import axios from "axios";
import { useDebounce } from "@/lib/hooks/useDebounce"; // We'll create this hook

export function StockSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<StockSearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        const fetchResults = async () => {
            if (!debouncedQuery) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const response = await axios.get(`/api/stocks/search?query=${debouncedQuery}`);
                setResults(response.data.results);
            } catch (error) {
                console.error("Error searching stocks:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [debouncedQuery]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (symbol: string) => {
        setQuery("");
        setShowResults(false);
        router.push(`/stock/${symbol}`);
    };

    return (
        <div className="relative w-full max-w-sm" ref={searchRef}>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search stocks (e.g. SM.PH)..."
                    className="pl-8"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                />
                {loading && (
                    <div className="absolute right-2.5 top-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                )}
            </div>

            {showResults && (query || results.length > 0) && (
                <Card className="absolute top-full mt-1 w-full z-50 max-h-[300px] overflow-y-auto">
                    {results.length > 0 ? (
                        <ul className="py-1">
                            {results.map((result) => (
                                <li
                                    key={result.symbol}
                                    className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer flex justify-between items-center"
                                    onClick={() => handleSelect(result.symbol)}
                                >
                                    <div>
                                        <span className="font-medium">{result.symbol}</span>
                                        <span className="ml-2 text-sm text-muted-foreground truncate max-w-[150px] inline-block align-bottom">
                                            {result.name}
                                        </span>
                                    </div>
                                    <span className="text-xs text-muted-foreground">{result.type}</span>
                                </li>
                            ))}
                        </ul>
                    ) : query && !loading ? (
                        <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                            No results found
                        </div>
                    ) : null}
                </Card>
            )}
        </div>
    );
}
