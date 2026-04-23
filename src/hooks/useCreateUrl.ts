import { supabase, supabaseUrl } from "@/db/supabase";
import { generateQrFromText } from "@/lib/helper";
import { checkUrlSafety, isValidUrl } from "@/lib/url-security";
import { useMutation } from "@tanstack/react-query";
import { nanoid } from "nanoid";

const APP_URL = import.meta.env.VITE_APP_URL;

if (!APP_URL) {
  throw new Error("VITE_APP_URL environment variable is not configured");
}

export const useCreateUrl = () => {
  return useMutation({
    mutationFn: async ({ title, original_url, custom_url, userId }: any) => {
      // Validate the URL
      if (!isValidUrl(original_url)) {
        throw new Error("Invalid URL");
      }

      let { is_safe, risk_reason } = checkUrlSafety(original_url);

      const shortUrl = nanoid(8);

      // checking the custom url uniqueness
      if (custom_url) {
        const { data: existing } = await supabase
          .from("urls")
          .select("id")
          .eq("custom_url", custom_url)
          .maybeSingle();

        if (existing) {
          throw new Error("Custom URL already exists");
        }
      }

      // 1. insert first without qr in db
      const { data, error } = await supabase
        .from("urls")
        .insert([
          {
            title,
            original_url,
            short_url: shortUrl,
            custom_url,
            user_id: userId,
            is_safe,
            risk_reason,
            checked_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);

      // 2. resolve slug
      const slug = data.custom_url || data.short_url;
      const normalizedAppUrl = APP_URL.endsWith("/") ? APP_URL : `${APP_URL}/`;
      const shortLink = `${normalizedAppUrl}${slug}`;

      // 3. generate QR from short link(with slug)
      const qrBlob = await generateQrFromText(shortLink);

      if (!userId || typeof userId !== "string") {
        throw new Error("userId is required");
      }

      const fileName = `${userId}/qr-${shortUrl}-${Date.now()}.png`;

      // 4. upload QR
      const { error: storageError } = await supabase.storage
        .from("qr")
        .upload(fileName, qrBlob);

      if (storageError) throw new Error(storageError.message);

      const qr = `${supabaseUrl}/storage/v1/object/public/qr/${fileName}`;

      // 5. update row with QR
      const { error: updateError } = await supabase
        .from("urls")
        .update({
          qr,
          qr_path: fileName,
        })
        .eq("id", data.id);

      if (updateError) throw new Error(updateError.message);

      return { ...data, qr };
    },
  });
};
