"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, formatDate } from "@/lib/utils/formatters";
import { LogOut, User, Mail, Calendar, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        router.push("/login");
        return null;
    }

    const handleSignOut = async () => {
        await signOut();
        router.push("/login");
    };

    const initials = user.displayName
        ? user.displayName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)
        : "U";

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 container py-8 px-4 md:px-6">
                <div className="max-w-2xl mx-auto space-y-8">
                    <div className="flex flex-col items-center space-y-4 text-center">
                        <Avatar className="h-24 w-24">
                            <AvatarImage src="" />
                            <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold">{user.displayName || "User"}</h1>
                            <p className="text-muted-foreground">{user.email}</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Virtual Balance
                                </CardTitle>
                                <Wallet className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatCurrency(user.virtualBalance)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Available for trading
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Account Created
                                </CardTitle>
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {formatDate(user.createdAt)}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Member since
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account Settings</CardTitle>
                            <CardDescription>
                                Manage your account preferences and session.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <LogOut className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Sign Out</p>
                                        <p className="text-sm text-muted-foreground">
                                            Log out of your account on this device.
                                        </p>
                                    </div>
                                </div>
                                <Button variant="destructive" onClick={handleSignOut}>
                                    Log Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
