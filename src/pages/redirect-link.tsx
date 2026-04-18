import { getLongUrl } from "@/db/urls.db";
import { storeClicks } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom"

const RedirectLink = () => {
    const { id } = useParams();
    if (!id) return <div>Invalid link</div>;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["link", id],
        queryFn: () => getLongUrl(id),
        enabled: !!id
    });

    console.log("supabase response:", data, error);
    console.log("LOOKING FOR:", id);

    useEffect(() => {
        if (!data?.original_url) return;
        if (!data.id) return;

        storeClicks({
            id: data.id,
        });

        window.location.replace(data.original_url);
    }, [data]);

    if (isLoading) {
        return (
            <div className="py-8 flex items-center justify-center">
                <Loader2 className="animate-spin" />
            </div>
        )
    }
    if (isError) return <div>Link not found</div>;

    return (
        <div className="py-8 text-center">
            <h1>Redirecting to {data?.original_url}</h1>
        </div>
    )
}

export default RedirectLink