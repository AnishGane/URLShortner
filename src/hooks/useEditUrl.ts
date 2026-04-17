import { updateUrl } from "@/db/urls.db";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditUrl = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUrl,

    onSuccess: (data) => {
      if (!data) return;

      toast.success("URL updated successfully");

      // refresh cached queries
      queryClient.invalidateQueries({
        queryKey: ["linkurl", data.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["urls", data.id],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
