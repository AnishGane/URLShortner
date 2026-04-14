import { useEffect } from "react";
import { supabase } from "@/db/supabase";
import { useQueryClient } from "@tanstack/react-query";

export const useRealtimeUrls = (userId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`urls-realtime-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "urls",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          queryClient.setQueryData(["urls", userId], (old: any[] = []) => {
            if (payload.eventType === "INSERT") {
              if (old.find((u) => u.id === payload.new.id)) return old;
              return [...old, payload.new];
            }

            if (payload.eventType === "DELETE") {
              return old.filter((url) => url.id !== payload.old.id);
            }

            if (payload.eventType === "UPDATE") {
              return old.map((url) =>
                url.id === payload.new.id ? payload.new : url,
              );
            }

            return old;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
};
