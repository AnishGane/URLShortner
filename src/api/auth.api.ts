import { supabase } from "@/db/supabase";

export const loginUser = async (email: string, password: string) => {
  if (!email || !password) return;
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
};
