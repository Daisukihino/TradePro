"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

export function Testimonials() {
    const testimonials = [
        {
            name: "Maria Santos",
            role: "Student Trader",
            avatar: "MS",
            rating: 5,
            text: "TradePro helped me understand the Philippine stock market without risking real money. The virtual trading feature is incredible!"
        },
        {
            name: "Juan Dela Cruz",
            role: "Aspiring Investor",
            avatar: "JD",
            rating: 5,
            text: "I went from knowing nothing about stocks to confidently trading within weeks. The real-time data for PH stocks is a game-changer."
        },
        {
            name: "Ana Reyes",
            role: "Finance Student",
            avatar: "AR",
            rating: 5,
            text: "Perfect for practicing trading strategies. The ₱100k virtual cash lets me experiment without fear. Highly recommended!"
        }
    ];

    return (
        <section className="w-full py-20 md:py-32">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                        Trusted by Thousands of Traders
                    </h2>
                    <p className="max-w-[600px] text-muted-foreground md:text-lg">
                        See what our community has to say about their trading journey.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="hover-lift transition-smooth">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <Avatar>
                                        <AvatarImage src="" />
                                        <AvatarFallback className="bg-primary/10 text-primary">
                                            {testimonial.avatar}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{testimonial.name}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-1 mb-3">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    &quot;{testimonial.text}&quot;
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
