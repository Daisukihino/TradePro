"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut } from "@/lib/firebase/auth";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(async (firebaseUser) => {
            if (firebaseUser) {
                // Subscribe to user document for real-time balance updates
                const userRef = doc(db, "users", firebaseUser.uid);
                const unsubscribeDoc = onSnapshot(userRef, (doc) => {
                    if (doc.exists()) {
                        const data = doc.data();
                        setUser({
                            uid: data.uid,
                            email: data.email,
                            displayName: data.displayName,
                            createdAt: new Date(data.createdAt),
                            virtualBalance: data.virtualBalance,
                        });
                    }
                });

                setLoading(false);
                return () => unsubscribeDoc();
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const signOut = async () => {
        await firebaseSignOut();
        router.push("/login");
    };

    return { user, loading, signOut };
}
