import { supabase } from "@/db/supabase";
import type { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

type AuthContextType = {
    user: User | null,
    session: Session | null,
    loading: boolean,
    loginUser: (email: string, password: string) => Promise<void>,
    logoutUser: () => Promise<void>
    isAuthenticated: boolean
    signupUser: (email: string, password: string, name: string, profile_pic: File) => Promise<{ user: User | null; session: Session | null }>
    // { user: User | null; session: Session | null } -> destructuring the AuthResponse from supabase
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const isAuthenticated = !!user;

    // Get initial session + listen to changes
    useEffect(() => {
        const getSession = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    console.error("Failed to get session:", error.message);
                } else {
                    setSession(data.session);
                    setUser(data.session?.user ?? null);
                }
            } finally {
                setLoading(false);
            }
        }
        getSession();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    // Login
    const loginUser = async (email: string, password: string) => {
        if (!email || !password) {
            throw new Error("Missing email or password");
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setLoading(false);
            throw new Error(error.message);
        }

        setLoading(false);
    };

    // Logout
    const logoutUser = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                setLoading(false);
                throw new Error(error.message);
            }
        } catch (error) {
            console.log("Error in logoutUser: ", error.message);
        } finally {
            setLoading(false);
        }
    }

    const signupUser = async (email: string, password: string, name: string, profile_pic: File) => {
        setLoading(true);
        const fileExt = profile_pic.name.split('.').pop();
        const fileName = `dp-${name.split(" ").join("-")}-${Date.now()}.${fileExt}`;
        const { error: storageError } = await supabase.storage.from("profile_pic").upload(fileName, profile_pic);
        if (storageError) {
            setLoading(false);
            throw new Error(storageError.message);
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    profile_pic: `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`,
                }
            }
        })

        if (!data) {
            setLoading(false);
            throw new Error("Signup failed");
        } if (error) {
            setLoading(false);
            throw new Error(error.message ?? "Something went wrong while signup");
        }

        setLoading(false);

        return data;
    }

    return (
        <AuthContext.Provider value={{
            user, loading, session, logoutUser, loginUser, isAuthenticated, signupUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
    return ctx;
};