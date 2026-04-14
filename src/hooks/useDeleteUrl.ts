import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/db/supabase";
import { toast } from "sonner";

export const useDeleteUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error: fetchError } = await supabase
        .from("urls")
        .select("qr_path")
        .eq("id", id)
        .single();
      if (fetchError) {
        throw new Error(fetchError.message);
      }

      if (data?.qr_path) {
        const [storageRes, clicksRes] = await Promise.all([
          supabase.storage.from("qr").remove([data.qr_path]),
          supabase.from("clicks").delete().eq("url_id", id),
        ]);

        if (storageRes.error) {
          console.warn("Storage delete failed:", storageRes.error.message);
        }
        if (clicksRes.error) {
          throw new Error(clicksRes.error.message);
        }
      } else {
        const { error: clicksError } = await supabase
          .from("clicks")
          .delete()
          .eq("url_id", id);

        if (clicksError) throw new Error(clicksError.message);
      }

      const { error: urlError } = await supabase
        .from("urls")
        .delete()
        .eq("id", id);
      if (urlError) throw new Error(urlError.message);
    },

    onSuccess: () => {
      toast.success("Link deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      queryClient.invalidateQueries({ queryKey: ["clicks"] });
    },
    onError: () => toast.error("Failed to delete link"),
  });
};
