const API_KEY = import.meta.env.VITE_SAFE_BROWSING_KEY;

export const checkSafeBrowsing = async (url: string) => {
  const res = await fetch(
    `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`,
    {
      method: "POST",
      body: JSON.stringify({
        client: { clientId: "url-shortener", clientVersion: "1.0" },
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url }],
        },
      }),
    },
  );

  const data = await res.json();
  return !data.matches; // true = safe
};
