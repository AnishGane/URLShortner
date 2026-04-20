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

// get original_url and id
export const getLongUrl = async (id: string) => {
  const { data, error } = await supabase
    .from("urls")
    .select("original_url, id, is_safe")
    .or(`short_url.eq.${id}, custom_url.eq.${id}`);

  if (error) {
    console.error(error.message);
    throw new Error("Error fetching long URL");
  }
  if (!data || data.length === 0) {
    throw new Error("URL not found");
  }
  return data[0];
};

export const getUrl = async (id: string) => {
  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error(error.message);
    throw new Error("Error fetching URL");
  }
  if (!data) {
    throw new Error("URL not found");
  }
  return data;
};

export const updateUrl = async ({
  id,
  title,
  original_url,
  custom_url,
  user_id,
}: {
  id: string;
  title: string;
  original_url: string;
  custom_url?: string | null;
  user_id: string;
}) => {
  const { data, error } = await supabase
    .from("urls")
    .update({
      title,
      original_url,
      custom_url: custom_url ?? null,
    })
    .eq("id", id)
    .eq("user_id", user_id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
};
