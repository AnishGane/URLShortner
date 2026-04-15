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

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};

export const downloadFile = (url: string, fileName?: string) => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    if (!["http:", "https:", "blob:", "data:"].includes(parsedUrl.protocol)) {
      console.error("Invalid URL protocol for download");
      return;
    }
  } catch {
    console.error("Invalid URL for download");
    return;
  }

  const anchor = document.createElement("a");
  anchor.href = url;
  if (fileName) anchor.download = fileName;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};
