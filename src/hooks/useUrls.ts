import { getUrls } from "@/db/urls.db";
import { useQuery } from "@tanstack/react-query";

export const useUrls = (userId?: string) => {
  return useQuery({
    queryKey: ["urls", userId],
    queryFn: () => getUrls(userId),
    enabled: !!userId,
  });
};
