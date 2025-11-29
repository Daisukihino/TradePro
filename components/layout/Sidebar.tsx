"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PieChart, List, History, TrendingUp, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Portfolio",
        href: "/portfolio",
        icon: PieChart,
    },
    {
        title: "Watchlist",
        href: "/watchlist",
        icon: List,
    },
    {
        title: "Transactions",
        href: "/transactions",
        icon: History,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut();
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="hidden border-r bg-background/95 backdrop-blur md:block md:w-64 lg:w-72 h-[calc(100vh-4rem)] sticky top-16 flex flex-col">
            <div className="flex-1 space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Overview
                    </h2>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                    pathname === item.href ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="mr-2 h-4 w-4" />
                                {item.title}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        Market
                    </h2>
                    <div className="space-y-1">
                        <Link
                            href="/market"
                            className={cn(
                                "flex items-center rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                pathname === "/market" ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                            )}
                        >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            Market Overview
                        </Link>
                    </div>
                </div>
            </div>

            {/* Profile & Logout Section */}
            <div className="mt-auto border-t">
                <div className="px-3 py-4 space-y-3">
                    {/* Profile Section */}
                    <Link
                        href="/profile"
                        className={cn(
                            "flex items-center gap-3 rounded-md px-4 py-3 hover:bg-accent transition-colors",
                            pathname === "/profile" ? "bg-accent" : ""
                        )}
                    >
                        <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                {user?.displayName ? getInitials(user.displayName) : <User className="h-4 w-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {user?.displayName || "Trader"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                                {user?.email}
                            </p>
                        </div>
                    </Link>

                    {/* Logout Button */}
                    <Button
                        variant="outline"
                        className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/20"
                        onClick={handleLogout}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </div>
            </div>
        </div>
    );
}
