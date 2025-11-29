import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, TrendingUp, Shield, BarChart3, PieChart, CheckCircle2, Zap, Globe } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { MarketUpdateCard } from "@/components/marketing/MarketUpdateCard";
import { TrustIndicators } from "@/components/marketing/TrustIndicators";
import { Testimonials } from "@/components/marketing/Testimonials";
import { Footer } from "@/components/marketing/Footer";
import { StockNews } from "@/components/marketing/StockNews";
import { LiveStockPrices } from "@/components/marketing/LiveStockPrices";

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <Navbar />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative w-full py-20 md:py-32 lg:py-40 overflow-hidden">
                    {/* Background Elements */}
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
                    <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] bg-blue-500/10 blur-[100px] rounded-full opacity-50"></div>
                    <div className="absolute bottom-0 left-0 -z-10 h-[600px] w-[600px] bg-purple-500/10 blur-[100px] rounded-full opacity-50"></div>

                    <div className="container px-4 md:px-6 relative">
                        <div className="flex flex-col items-center text-center space-y-10">
                            <div className="flex flex-col items-center space-y-6 max-w-3xl mx-auto">
                                <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
                                    <Zap className="mr-1 h-3 w-3" />
                                    New: Philippine Stocks Added
                                </div>
                                <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl xl:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                    Master the Market <br />
                                    <span className="text-primary">Risk-Free.</span>
                                </h1>
                                <p className="max-w-[600px] text-muted-foreground md:text-xl leading-relaxed mx-auto">
                                    Experience real-time trading with <strong>₱100,000</strong> in virtual cash.
                                    Build your portfolio, track your performance, and learn to trade like a pro without losing a cent.
                                </p>
                                <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center w-full">
                                    <Link href="/signup">
                                        <Button size="lg" className="w-full min-[400px]:w-auto h-12 px-8 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                                            Start Trading Now <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/market">
                                        <Button variant="outline" size="lg" className="w-full min-[400px]:w-auto h-12 px-8 text-base backdrop-blur-sm bg-background/50">
                                            View Market
                                        </Button>
                                    </Link>
                                </div>
                                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground flex-wrap">
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Real-time Data</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>No Credit Card</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        <span>Instant Access</span>
                                    </div>
                                </div>
                            </div>

                            {/* Hero Visual */}
                            <div className="relative w-full max-w-4xl mx-auto mt-8">
                                <div className="relative aspect-[21/9] rounded-2xl border bg-background/50 backdrop-blur-xl shadow-2xl overflow-hidden ring-1 ring-white/10">
                                    <MarketUpdateCard />
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute -top-12 -right-12 h-32 w-32 bg-yellow-500/20 rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-12 -left-12 h-40 w-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-20 md:py-32 bg-muted/30">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                Everything You Need to Trade
                            </h2>
                            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
                                Our platform provides professional-grade tools to help you analyze the market and make informed decisions.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center justify-center">
                            <Card className="bg-background/50 backdrop-blur-sm border-muted/50 transition-all hover:shadow-lg hover:-translate-y-1 text-center flex flex-col items-center">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 mx-auto">
                                        <TrendingUp className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <CardTitle>Real-Time Data</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Access live stock prices and market trends for Philippine stocks. Stay ahead of the curve with up-to-the-minute data.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-background/50 backdrop-blur-sm border-muted/50 transition-all hover:shadow-lg hover:-translate-y-1 text-center flex flex-col items-center">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 mx-auto">
                                        <Shield className="h-6 w-6 text-green-500" />
                                    </div>
                                    <CardTitle>Risk-Free Environment</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Practice with ₱100,000 in virtual currency. Test your strategies and learn from your mistakes without risking real money.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="bg-background/50 backdrop-blur-sm border-muted/50 transition-all hover:shadow-lg hover:-translate-y-1 text-center flex flex-col items-center">
                                <CardHeader>
                                    <div className="h-12 w-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 mx-auto">
                                        <PieChart className="h-6 w-6 text-purple-500" />
                                    </div>
                                    <CardTitle>Portfolio Analytics</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">
                                        Track your performance with detailed charts. Analyze your gains, losses, and asset allocation to optimize your strategy.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="w-full py-20 md:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                                How It Works
                            </h2>
                            <p className="max-w-[600px] text-muted-foreground md:text-lg">
                                Start your trading journey in three simple steps.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative items-center justify-center">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent -z-10"></div>

                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-24 w-24 rounded-full bg-background border-4 border-muted flex items-center justify-center shadow-sm z-10">
                                    <span className="text-3xl font-bold text-muted-foreground/50">1</span>
                                </div>
                                <h3 className="text-xl font-bold">Sign Up</h3>
                                <p className="text-muted-foreground">
                                    Create your free account in seconds. No credit card required.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-24 w-24 rounded-full bg-background border-4 border-primary/20 flex items-center justify-center shadow-sm z-10">
                                    <span className="text-3xl font-bold text-primary">2</span>
                                </div>
                                <h3 className="text-xl font-bold">Practice</h3>
                                <p className="text-muted-foreground">
                                    Get ₱100k virtual cash and start trading real stocks instantly.
                                </p>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-24 w-24 rounded-full bg-background border-4 border-muted flex items-center justify-center shadow-sm z-10">
                                    <span className="text-3xl font-bold text-muted-foreground/50">3</span>
                                </div>
                                <h3 className="text-xl font-bold">Master</h3>
                                <p className="text-muted-foreground">
                                    Analyze your trades, refine your strategy, and become a pro.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Live Stock Prices Section */}
                <LiveStockPrices />

                {/* Stock News Section */}
                <StockNews />

                {/* CTA Section */}
                <section className="w-full py-24 md:py-32 bg-primary/5 relative overflow-hidden">
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
                    <div className="container flex flex-col items-center justify-center gap-6 px-4 text-center md:px-6 relative">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter md:text-5xl">
                                Ready to Start Your Journey?
                            </h2>
                            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                                Join thousands of traders improving their skills on TradePro today.
                            </p>
                        </div>
                        <div className="mx-auto w-full max-w-sm space-y-2">
                            <Link href="/signup">
                                <Button size="lg" className="w-full h-12 text-lg shadow-xl shadow-primary/20">
                                    Create Free Account
                                </Button>
                            </Link>
                            <p className="text-xs text-muted-foreground pt-2">
                                No credit card required • Cancel anytime
                            </p>
                        </div>
                    </div>
                </section>

                {/* Trust Indicators */}
                <TrustIndicators />

                {/* Testimonials */}
                <Testimonials />
            </main>
            <Footer />
        </div>
    );
}
