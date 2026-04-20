const WHITELIST_DOMAINS = new Set([
  "instagram.com",
  "www.instagram.com",
  "google.com",
  "www.google.com",
  "youtube.com",
  "www.youtube.com",
  "github.com",
  "www.github.com",
]);

// Check the validity of a URL
export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}

function getHostname(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function checkUrlSafety(url: string) {
  const hostname = getHostname(url);

  if (!hostname) {
    return {
      is_safe: false,
      risk_reason: "Invalid URL",
    };
  }

  // whitelist override (highest priority)
  if (WHITELIST_DOMAINS.has(hostname)) {
    return {
      is_safe: true,
      risk_reason: "Whitelisted domain",
    };
  }

  // suspicious heuristics
  const lowered = url.toLowerCase();
  const suspiciousWords = [
    "login",
    "verify",
    "password",
    "bank",
    "free",
    "win",
  ];

  const hasKeyword = suspiciousWords.some((w) => lowered.includes(w));

  const isTooLong = url.length > 120;

  const hasIp = /^\d+\.\d+\.\d+\.\d+/.test(hostname);

  const isSuspicious = hasKeyword || isTooLong || hasIp;

  return {
    is_safe: !isSuspicious,
    reason: isSuspicious ? "Suspicious pattern detected" : "",
  };
}
