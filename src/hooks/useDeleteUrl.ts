import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/db/supabase";
import { toast } from "sonner";

export const useDeleteUrl = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error: clickError } = await supabase
        .from("clicks")
        .delete()
        .eq("url_id", id);
      if (clickError) throw new Error(clickError.message);

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
