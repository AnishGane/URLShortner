const WHITELIST_DOMAINS = new Set([
  "instagram.com",
  "google.com",
  "youtube.com",
  "github.com",
]);

// Normalize hostname (removes www.)
function normalizeHostname(hostname: string) {
  return hostname.replace(/^www\./, "");
}

// Check the validity of a URL
export function isValidUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    return (
      ["http:", "https:"].includes(parsedUrl.protocol) &&
      Boolean(parsedUrl.hostname)
    );
  } catch {
    return false;
  }
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function checkUrlSafety(url: string) {
  const hostnameRaw = getHostname(url);

  if (!hostnameRaw) {
    return {
      is_safe: false,
      risk_reason: "Invalid URL",
    };
  }

  const hostname = normalizeHostname(hostnameRaw);
  const lowered = url.toLowerCase();

  // Detect IP usage (strong signal)
  const hasIpv4 =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      hostname,
    );

  const hasIpv6 = hostname.includes(":") && /^[0-9a-f:]+$/i.test(hostname);

  const hasIp = hasIpv4 || hasIpv6;

  const isTooLong = url.length > 200;

  // Contextual keyword check (NOT standalone)
  const suspiciousWords = ["login", "verify", "password", "bank"];
  const hasKeyword = suspiciousWords.some((w) => lowered.includes(w));

  // Only suspicious if keyword + something else risky
  const keywordRisk = hasKeyword && (hasIp || isTooLong);

  // Whitelist (soft trust)
  const isWhitelisted = WHITELIST_DOMAINS.has(hostname);

  // Final decision
  const isSuspicious = hasIp || isTooLong || keywordRisk;

  // Whitelist reduces false positives but does NOT override hard risks
  const is_safe = isWhitelisted ? !hasIp && !isTooLong : !isSuspicious;

  let risk_reason = "";

  if (hasIp) {
    risk_reason = "IP-based URL detected";
  } else if (isTooLong) {
    risk_reason = "URL too long (possible obfuscation)";
  } else if (keywordRisk) {
    risk_reason = "Suspicious keyword with risk context";
  }

  return {
    is_safe,
    risk_reason,
  };
}
