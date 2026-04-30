import { supabase, supabaseUrl } from "@/db/supabase";
import { handleOAuthProfile } from "@/lib/helper";
import type { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    user: User | null,
    session: Session | null,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>,
    loginUser: (email: string, password: string) => Promise<void>,
    logoutUser: () => Promise<void>
    isAuthenticated: boolean
    signupUser: (
        email: string,
        password: string,
        name: string,
        profile_pic?: File
    ) => Promise<void>;
    signInWithGoogle: () => Promise<void>
    signInWithGithub: () => Promise<void>
    oAuthLoading: "google" | "github" | null
    setOAuthLoading: React.Dispatch<React.SetStateAction<"google" | "github" | null>>
    logoutLoading: boolean
    setLogoutLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [oAuthLoading, setOAuthLoading] = useState<"google" | "github" | null>(null);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const isAuthenticated = !!user;

    // Get initial session + listen to changes
    useEffect(() => {
        const init = async () => {
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
        init();

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            // Auto create profile for OAuth users
            if (session?.user) {
                handleOAuthProfile(session.user);
            }
        });

        return () => {
            listener.subscription.unsubscribe();
        };
    }, []);

    // Email Login
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

    // Signup
    const signupUser = async (email: string, password: string, name: string, profile_pic?: File) => {
        setLoading(true);

        let profilePicUrl = null;

        if (profile_pic) {
            const fileExt = profile_pic.name.split('.').pop();
            const fileName = `dp-${name.split(" ").join("-")}-${Date.now()}.${fileExt}`;
            const { error: storageError } = await supabase.storage.from("profile_pic").upload(fileName, profile_pic);
            if (storageError) {
                setLoading(false);
                throw new Error(storageError.message);
            }

            profilePicUrl = `${supabaseUrl}/storage/v1/object/public/profile_pic/${fileName}`;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    profile_pic: profilePicUrl,
                },
            },
        });

        setLoading(false);
        if (error) {
            throw new Error(error.message ?? "Something went wrong while signup");
        }
    }

    // OAUTH
    const signInWithGoogle = async () => {
        setOAuthLoading("google");

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback${window.location.search || ''}`,
            }
        })

        if (error) {
            setOAuthLoading(null);
            throw new Error(error.message);
        }
    };

    const signInWithGithub = async () => {
        setOAuthLoading("github");
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: `${window.location.origin}/auth/callback${window.location.search || ''}`,
            },
        });

        if (error) {
            setOAuthLoading(null);
            throw new Error(error.message);
        }
    };

    // Logout
    const logoutUser = async () => {
        setLogoutLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw new Error(error.message);
            }
        } finally {
            setLogoutLoading(false);
        }
    }
    return (
        <AuthContext.Provider value={{
            user, loading, setLoading, session, logoutUser, loginUser, isAuthenticated, signupUser, signInWithGithub, signInWithGoogle, oAuthLoading, setOAuthLoading, logoutLoading, setLogoutLoading
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