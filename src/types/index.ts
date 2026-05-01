import type { Session, User } from "@supabase/supabase-js";

export type State = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  oAuthLoading: "google" | "github" | null;
  logoutLoading: boolean;
};

export type Action =
  | { type: "SET_SESSION"; payload: Session | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_OAUTH_LOADING"; payload: "google" | "github" | null }
  | { type: "SET_LOGOUT_LOADING"; payload: boolean };

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  isAuthenticated: boolean;
  signupUser: (
    email: string,
    password: string,
    name: string,
    profile_pic?: File,
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  oAuthLoading: "google" | "github" | null;
  logoutLoading: boolean;
  dispatch: React.Dispatch<Action>;
};

type URL = {
  id: string;
  title: string;
  original_url: string;
  custom_url: string;
  short_url: string;
};
export interface EditLinkFormProps {
  url: URL;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export type Faq = {
  id: number;
  value: string;
  trigger: string;
  content: string;
};

export type Feature = {
  id: number;
  title: string;
  image: string;
  description: string;
};
