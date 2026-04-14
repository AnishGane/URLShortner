import { supabase } from "./supabase";

export const getUrls = async (userId: string) => {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", userId);
  if (error) {
    console.error(error.message);
    throw new Error("Unable to load URLs");
  }
  return data;
};
