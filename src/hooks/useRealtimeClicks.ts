import { useEffect } from "react";
import { supabase } from "@/db/supabase";
import { useQueryClient } from "@tanstack/react-query";

export const useRealtimeClicks = (urlIds: string[]) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!urlIds.length) return;

    const channel = supabase
      .channel("clicks-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "clicks",
        },
        (payload) => {
          queryClient.setQueryData(["clicks", urlIds], (old: any[] = []) => {
            if (payload.eventType === "INSERT") {
              // Only add clicks that belong to one of the tracked URLs
              if (!urlIds.includes(payload.new.url_id)) return old;
              if (old.find((u) => u.id === payload.new.id)) return old;
              return [...old, payload.new];
            }

            return old;
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [urlIds, queryClient]);
};
