const WHITELIST_DOMAINS = new Set([
  "instagram.com",
  "google.com",
  "youtube.com",
  "github.com",
]);

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function normalizeHostname(hostname: string) {
  return hostname.replace(/^www\./, "");
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
    return { is_safe: false, risk_reason: "Invalid URL" };
  }

  const hostname = normalizeHostname(hostnameRaw);
  const lowered = url.toLowerCase();
  const parts = hostname.split(".");
  const domainName = parts[0];
  const tld = parts[parts.length - 1];

  const isWhitelisted = WHITELIST_DOMAINS.has(hostname);

  // 1. IP detection
  const hasIpv4 = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\./.test(hostname);

  const hasIpv6 = hostname.includes(":") && /^[0-9a-f:]+$/i.test(hostname);

  const hasIp = hasIpv4 || hasIpv6;

  // 2. Length anomaly
  const isTooLong = url.length > 180;

  // 3. Suspicious domain patterns
  const suspiciousTlds = ["tk", "ml", "ga", "cf", "gq", "xyz"];

  const isSuspiciousTld = suspiciousTlds.includes(tld);
  const isShortDomain = domainName.length < 1;
  const hasHyphen = hostname.includes("-");
  const manySubdomains = parts.length > 3;

  const looksFakeDomain =
    hostname === "www.com" ||
    hostname === "www.co" ||
    hostname === "test" ||
    parts.length < 2;

  const domainRisk =
    isShortDomain ||
    isSuspiciousTld ||
    looksFakeDomain ||
    manySubdomains ||
    (hasHyphen && domainName.length < 12);

  // 4. Keyword detection (FIXED)
  const suspiciousWords = [
    "login",
    "verify",
    "password",
    "bank",
    "secure",
    "account",
  ];

  const hasKeyword = suspiciousWords.some((w) => lowered.includes(w));

  // KEY FIX:
  const keywordRisk = hasKeyword && !isWhitelisted;

  // 5. Final decision
  const isSuspicious = hasIp || isTooLong || domainRisk || keywordRisk;

  const is_safe = !isSuspicious;

  let risk_reason = "";

  if (hasIp) risk_reason = "IP-based URL detected";
  else if (looksFakeDomain) risk_reason = "Invalid domain";
  else if (isSuspiciousTld) risk_reason = "Suspicious TLD";
  else if (isShortDomain) risk_reason = "Very short domain";
  else if (manySubdomains) risk_reason = "Too many subdomains";
  else if (domainRisk) risk_reason = "Suspicious domain structure";
  else if (keywordRisk) risk_reason = "Phishing-like keywords";
  else if (isTooLong) risk_reason = "URL too long";

  return {
    is_safe,
    risk_reason,
  };
}
