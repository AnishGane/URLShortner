import { supabase, supabaseUrl } from "@/db/supabase";
import { buildRedirectUrl, handleOAuthProfile } from "@/lib/helper";
import type { Action, AuthContextType, State } from "@/types";
import React, { createContext, useContext, useEffect, useReducer } from "react";

// Reducer
const initialState: State = {
    user: null,
    session: null,
    loading: true,
    oAuthLoading: null,
    logoutLoading: false
}

const authReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "SET_SESSION":
            return {
                ...state,
                session: action.payload,
                user: action.payload?.user ?? null
            };
        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload
            };
        case "SET_OAUTH_LOADING":
            return {
                ...state,
                oAuthLoading: action.payload
            };
        case "SET_LOGOUT_LOADING":
            return {
                ...state,
                logoutLoading: action.payload
            };
        default:
            return state
    }
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {

    const [state, dispatch] = useReducer(authReducer, initialState);
    const isAuthenticated = !!state.user;

    // Get initial session + listen to changes
    useEffect(() => {
        const init = async () => {
            try {
                const { data, error } = await supabase.auth.getSession();
                if (error) {
                    console.error("Failed to get session:", error.message);
                } else {
                    dispatch({ type: "SET_SESSION", payload: data.session });
                }
            } finally {
                dispatch({ type: "SET_LOADING", payload: false });
            }
        }
        init();

        const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
            dispatch({ type: "SET_SESSION", payload: session });

            // Auto create profile for OAuth users
            if (session?.user) {
                await handleOAuthProfile(session.user);
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

        dispatch({ type: "SET_LOADING", payload: true });

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        dispatch({ type: "SET_LOADING", payload: false });

        if (error) {
            throw new Error(error.message);
        }
    };

    // Signup
    const signupUser = async (email: string, password: string, name: string, profile_pic?: File) => {

        dispatch({ type: "SET_LOADING", payload: true });

        let profilePicUrl: string | null = null;

        if (profile_pic) {
            const fileExt = profile_pic.name.split('.').pop();
            const fileName = `dp-${name.split(" ").join("-")}-${Date.now()}.${fileExt}`;

            const { error: storageError } = await supabase.storage
                .from("profile_pic")
                .upload(fileName, profile_pic);

            if (storageError) {
                dispatch({ type: "SET_LOADING", payload: false });
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

        dispatch({ type: "SET_LOADING", payload: false });

        if (error) {
            throw new Error(error.message ?? "Something went wrong while signup");
        }
    }

    // OAUTH
    const signInWithGoogle = async () => {

        dispatch({ type: "SET_OAUTH_LOADING", payload: "google" });
        const createNew = new URLSearchParams(window.location.search).get("createNew");
        if (createNew) {
            localStorage.setItem("createNew", createNew);
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: buildRedirectUrl(),
            }
        })

        if (error) {
            dispatch({ type: "SET_OAUTH_LOADING", payload: null });
            throw new Error(error.message);
        }
    };

    const signInWithGithub = async () => {

        dispatch({ type: "SET_OAUTH_LOADING", payload: "github" });
        const createNew = new URLSearchParams(window.location.search).get("createNew");
        if (createNew) {
            localStorage.setItem("createNew", createNew);
        }

        const { error } = await supabase.auth.signInWithOAuth({
            provider: "github",
            options: {
                redirectTo: buildRedirectUrl(),
            },
        });

        if (error) {
            dispatch({ type: "SET_OAUTH_LOADING", payload: null });
            throw new Error(error.message);
        }
    };

    // Logout
    const logoutUser = async () => {

        dispatch({ type: "SET_LOGOUT_LOADING", payload: true });

        try {
            const { error } = await supabase.auth.signOut();
            if (error) {
                throw new Error(error.message);
            }
        } finally {
            dispatch({ type: "SET_LOGOUT_LOADING", payload: false });
        }
    }

    return (
        <AuthContext.Provider value={{
            user: state.user,
            loading: state.loading,
            session: state.session,
            logoutUser,
            loginUser,
            isAuthenticated,
            signupUser,
            signInWithGithub,
            signInWithGoogle,
            oAuthLoading: state.oAuthLoading,
            logoutLoading: state.logoutLoading,
            dispatch

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