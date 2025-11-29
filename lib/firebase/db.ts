import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    addDoc,
    query,
    where,
    orderBy,
    getDocs,
    deleteDoc,
    increment,
    Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import {
    User,
    Portfolio,
    Transaction,
    WatchlistItem,
    StockHolding,
} from "@/types";

// --- User Operations ---

export async function getUserProfile(userId: string): Promise<User | null> {
    try {
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
            const data = userDoc.data();
            return {
                uid: data.uid,
                email: data.email,
                displayName: data.displayName,
                createdAt: new Date(data.createdAt),
                virtualBalance: data.virtualBalance,
            };
        }
        return null;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        throw error;
    }
}

export async function updateVirtualBalance(
    userId: string,
    amount: number
): Promise<void> {
    try {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            virtualBalance: increment(amount),
        });

        // Also update portfolio cash balance
        const portfolioRef = doc(db, "portfolios", userId);
        await updateDoc(portfolioRef, {
            cashBalance: increment(amount),
        });
    } catch (error) {
        console.error("Error updating balance:", error);
        throw error;
    }
}

// --- Portfolio Operations ---

export async function getPortfolio(userId: string): Promise<Portfolio | null> {
    try {
        const portfolioDoc = await getDoc(doc(db, "portfolios", userId));
        if (portfolioDoc.exists()) {
            return portfolioDoc.data() as Portfolio;
        }
        return null;
    } catch (error) {
        console.error("Error fetching portfolio:", error);
        throw error;
    }
}

export async function updatePortfolio(
    userId: string,
    holdings: StockHolding[]
): Promise<void> {
    try {
        const portfolioRef = doc(db, "portfolios", userId);
        await updateDoc(portfolioRef, {
            holdings: holdings,
        });
    } catch (error) {
        console.error("Error updating portfolio:", error);
        throw error;
    }
}

// --- Transaction Operations ---

export async function addTransaction(transaction: Omit<Transaction, "id">): Promise<string> {
    try {
        const transactionsRef = collection(db, "transactions");
        const docRef = await addDoc(transactionsRef, {
            ...transaction,
            timestamp: transaction.timestamp.toISOString(),
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding transaction:", error);
        throw error;
    }
}

export async function updateTransaction(transaction: Transaction): Promise<void> {
    try {
        const transactionRef = doc(db, "transactions", transaction.id);
        await updateDoc(transactionRef, {
            ...transaction,
            timestamp: transaction.timestamp.toISOString(),
        });
    } catch (error) {
        console.error("Error updating transaction:", error);
        throw error;
    }
}

export async function deleteTransaction(transactionId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, "transactions", transactionId));
    } catch (error) {
        console.error("Error deleting transaction:", error);
        throw error;
    }
}

export async function getTransactions(userId: string): Promise<Transaction[]> {
    try {
        const transactionsRef = collection(db, "transactions");
        const q = query(
            transactionsRef,
            where("userId", "==", userId),
            orderBy("timestamp", "desc")
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                userId: data.userId,
                type: data.type,
                symbol: data.symbol,
                companyName: data.companyName,
                shares: data.shares,
                pricePerShare: data.pricePerShare,
                totalAmount: data.totalAmount,
                timestamp: new Date(data.timestamp),
            };
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        throw error;
    }
}

// --- Watchlist Operations ---

export async function getWatchlist(userId: string): Promise<WatchlistItem[]> {
    try {
        const watchlistRef = collection(db, "watchlists");
        const q = query(watchlistRef, where("userId", "==", userId));

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                userId: data.userId,
                symbol: data.symbol,
                companyName: data.companyName,
                addedAt: new Date(data.addedAt),
            };
        });
    } catch (error) {
        console.error("Error fetching watchlist:", error);
        throw error;
    }
}

export async function addToWatchlist(
    userId: string,
    symbol: string,
    companyName: string
): Promise<void> {
    try {
        // Check if already in watchlist
        const watchlistRef = collection(db, "watchlists");
        const q = query(
            watchlistRef,
            where("userId", "==", userId),
            where("symbol", "==", symbol)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            return; // Already exists
        }

        await addDoc(watchlistRef, {
            userId,
            symbol,
            companyName,
            addedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error adding to watchlist:", error);
        throw error;
    }
}

export async function removeFromWatchlist(
    userId: string,
    symbol: string
): Promise<void> {
    try {
        const watchlistRef = collection(db, "watchlists");
        const q = query(
            watchlistRef,
            where("userId", "==", userId),
            where("symbol", "==", symbol)
        );

        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
        });
    } catch (error) {
        console.error("Error removing from watchlist:", error);
        throw error;
    }
}
