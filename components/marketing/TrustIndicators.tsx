"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Award, Globe } from "lucide-react";

export function TrustIndicators() {
    const stats = [
        {
            icon: Users,
            value: "10,000+",
            label: "Active Traders",
            color: "text-blue-600"
        },
        {
            icon: TrendingUp,
            value: "₱500M+",
            label: "Virtual Trades Executed",
            color: "text-green-600"
        },
        {
            icon: Award,
            value: "95%",
            label: "Success Rate",
            color: "text-purple-600"
        },
        {
            icon: Globe,
            value: "24/7",
            label: "Market Access",
            color: "text-orange-600"
        }
    ];

    return (
        <section className="w-full py-16 bg-muted/30">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={index} className="text-center hover-lift transition-smooth">
                                <CardContent className="pt-6 pb-6">
                                    <Icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
