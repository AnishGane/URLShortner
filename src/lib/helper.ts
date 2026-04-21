import { supabase } from "@/db/supabase";
import { UAParser } from "ua-parser-js";
import QRCode from "qrcode";

const parser = new UAParser();

export const storeClicks = async ({ id }: { id: string }) => {
  const res = parser.getResult();
  const device = res.device.type || "desktop";

  let city = null;
  let country = null;

  try {
    const response = await fetch("https://ipapi.co/json");
    const geo = await response.json();
    city = geo.city;
    country = geo.country_name;
  } catch {}

  await supabase.from("clicks").insert({
    url_id: id,
    device,
    city,
    country,
  });
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
  anchor.target = "_blank";
  if (fileName) anchor.download = fileName;

  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
};

export const generateQrFromText = async (text: string): Promise<Blob> => {
  try {
    // create canvas
    const canvas = document.createElement("canvas");

    // draw QR onto canvas
    await QRCode.toCanvas(canvas, text, {
      width: 300,
      margin: 2,
    });

    // convert canvas → blob
    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), "image/png"),
    );

    if (!blob) {
      throw new Error("QR generation failed");
    }

    return blob;
  } catch (error) {
    throw new Error("Failed to generate QR");
  }
};

export const getDisplayNameFromEmail = (email: string) => {
  const localPart = email.split("@")[0] || "";
  const sanitizedLocalPart = localPart.replace(/[0-9]/g, "");
  return (
    sanitizedLocalPart.charAt(0).toUpperCase() + sanitizedLocalPart.slice(1)
  );
};

export const shareLink = async (link: string) => {
  // Native share (best for UX on mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: "Check this out",
        text: "Check out this link",
        url: link,
      });
      return;
    } catch (error) {
      // User cancelled or share failed—fall through to clipboard
    }
  }

  // // Fallback → copy to clipboard
  // const success = await copyToClipboard(link);
  // if (success) {
  //   alert("Link copied to clipboard");
  // } else {
  //   alert("Failed to copy link");
  // }
};
