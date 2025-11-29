import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged as firebaseOnAuthStateChanged,
    sendPasswordResetEmail,
    User as FirebaseUser,
    UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { User } from "@/types";

const INITIAL_BALANCE = Number(process.env.NEXT_PUBLIC_INITIAL_BALANCE) || 100000;

/**
 * Sign up a new user with email and password
 */
export async function signUp(
    email: string,
    password: string,
    displayName: string
): Promise<User> {
    try {
        const userCredential: UserCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        // Create user document in Firestore
        const userData: User = {
            uid: user.uid,
            email: user.email!,
            displayName: displayName,
            createdAt: new Date(),
            virtualBalance: INITIAL_BALANCE,
        };

        await setDoc(doc(db, "users", user.uid), {
            ...userData,
            createdAt: userData.createdAt.toISOString(),
        });

        // Initialize empty portfolio
        await setDoc(doc(db, "portfolios", user.uid), {
            userId: user.uid,
            holdings: [],
            totalValue: 0,
            cashBalance: INITIAL_BALANCE,
            totalGainLoss: 0,
            totalGainLossPercent: 0,
        });

        return userData;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Sign up failed: ${error.message}`);
        }
        throw new Error("Sign up failed");
    }
}

/**
 * Sign in an existing user
 */
export async function signIn(email: string, password: string): Promise<User> {
    try {
        const userCredential: UserCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
            throw new Error("User data not found");
        }

        const userData = userDoc.data();

        return {
            uid: user.uid,
            email: user.email!,
            displayName: userData.displayName,
            createdAt: new Date(userData.createdAt),
            virtualBalance: userData.virtualBalance,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Sign in failed: ${error.message}`);
        }
        throw new Error("Sign in failed");
    }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
    try {
        await firebaseSignOut(auth);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Sign out failed: ${error.message}`);
        }
        throw new Error("Sign out failed");
    }
}

/**
 * Send password reset email
 */
export async function resetPassword(email: string): Promise<void> {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Password reset failed: ${error.message}`);
        }
        throw new Error("Password reset failed");
    }
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
}

/**
 * Listen to auth state changes
 */
export function onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return firebaseOnAuthStateChanged(auth, callback);
}
