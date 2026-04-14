import { supabase, supabaseUrl } from "@/db/supabase";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";

export const useCreateUrl = () => {
  return useMutation({
    mutationFn: async ({
      title,
      original_url,
      custom_url,
      userId,
      qrcode,
    }: any) => {
      const shortUrl = nanoid(8);
      const fileName = `qr-${shortUrl}-${Date.now()}.png`;

      const { error: storageError } = await supabase.storage
        .from("qr")
        .upload(fileName, qrcode);

      if (storageError) throw new Error(storageError.message);

      const qr = `${supabaseUrl}/storage/v1/object/public/qr/${fileName}`;

      if (custom_url) {
        const { data: existingCustomUrl } = await supabase
          .from("urls")
          .select("custom_url")
          .eq("custom_url", custom_url)
          .maybeSingle();

        if (existingCustomUrl) {
          throw new Error("Custom URL already exists");
        }
      }

      const { data, error } = await supabase
        .from("urls")
        .insert([
          {
            title,
            original_url,
            short_url: shortUrl,
            custom_url,
            qr,
            user_id: userId,
          },
        ])
        .select();
      console.log("data", data);

      if (error) {
        console.error(error.message);
        throw new Error(error.message);
      }

      return data[0];
    },
  });
};
