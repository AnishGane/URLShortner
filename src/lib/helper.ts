import { supabase } from "@/db/supabase";
import { UAParser } from "ua-parser-js";

const parser = new UAParser();

export const storeClicks = ({
  id,
  original_url,
}: {
  id: string;
  original_url: string;
}) => {
  const res = parser.getResult();
  const device = res.device.type || "desktop";

  // Run async in background
  (async () => {
    try {
      let city = null;
      let country = null;

      try {
        const response = await fetch("https://ipapi.co/json");
        const geo = await response.json();
        city = geo.city;
        country = geo.country_name;
      } catch {
        // ignore geo errors
      }

      await supabase.from("clicks").insert({
        url_id: id,
        device,
        city,
        country,
      });
    } catch (error) {
      console.error("Tracking failed:", error);
    }
  })();

  // Instant redirect (no waiting)
  window.location.replace(original_url);
};
