"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper, ExternalLink } from "lucide-react";
import Link from "next/link";

interface NewsItem {
    id: string;
    title: string;
    description: string;
    source: string;
    publishedAt: string;
    url: string;
}

// Mock Philippine stock market news data
const mockNews: NewsItem[] = [
    {
        id: "1",
        title: "PSEi Closes Higher on Strong Banking Sector Performance",
        description: "The Philippine Stock Exchange index (PSEi) gained 1.2% today, driven by strong performances from major banking stocks including BDO and BPI.",
        source: "Philippine Daily Inquirer",
        publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        url: "#",
    },
    {
        id: "2",
        title: "SM Investments Announces Expansion Plans for 2024",
        description: "SM Investments Corporation revealed ambitious expansion plans, targeting new retail and property developments across Metro Manila and key provinces.",
        source: "BusinessWorld",
        publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
        url: "#",
    },
    {
        id: "3",
        title: "Ayala Land Reports Strong Q4 Earnings",
        description: "Ayala Land Inc. posted a 15% increase in net income for Q4, exceeding analyst expectations amid robust demand for residential properties.",
        source: "Manila Bulletin",
        publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
        url: "#",
    },
    {
        id: "4",
        title: "Philippine Peso Strengthens Against Dollar",
        description: "The peso appreciated to 55.50 against the US dollar, its strongest level in three months, supported by increased remittances and foreign investments.",
        source: "Rappler",
        publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        url: "#",
    },
];

function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
}

export function NewsCard({ news }: { news: NewsItem }) {
    return (
        <Card className="group hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer h-full flex flex-col">
            <CardHeader className="flex-1">
                <div className="flex items-start gap-2 mb-2">
                    <Newspaper className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-base line-clamp-2 group-hover:text-primary transition-colors">
                            {news.title}
                        </CardTitle>
                    </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3">
                    {news.description}
                </p>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium">{news.source}</span>
                    <span>{formatTimeAgo(news.publishedAt)}</span>
                </div>
                <Link
                    href={news.url}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-2"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Read more
                    <ExternalLink className="h-3 w-3" />
                </Link>
            </CardContent>
        </Card>
    );
}

export function StockNews() {
    return (
        <section className="w-full py-20 md:py-32 bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold bg-primary/10 text-primary border-primary/20">
                        <Newspaper className="h-4 w-4" />
                        Latest Updates
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Philippine Stock Market News
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-lg">
                        Stay informed with the latest news and updates from the Philippine Stock Exchange
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
                    {mockNews.map((news) => (
                        <NewsCard key={news.id} news={news} />
                    ))}
                </div>
            </div>
        </section>
    );
}
