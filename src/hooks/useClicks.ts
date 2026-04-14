import { getClicksForURLs } from "@/db/clicks.db";
import { useQuery } from "@tanstack/react-query";

export const useClicks = (urlIds: string[]) => {
  return useQuery({
    queryKey: ["clicks", urlIds],
    queryFn: () => getClicksForURLs(urlIds),
    enabled: urlIds.length > 0,
  });
};
