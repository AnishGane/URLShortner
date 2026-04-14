import { getLongUrl } from "@/db/urls.db";
import { storeClicks } from "@/lib/helper";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useParams } from "react-router-dom"

const RedirectLink = () => {
    const { id } = useParams();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["link", id],
        queryFn: () => getLongUrl(id),
        enabled: !!id
    });

    useEffect(() => {
        if (data) {
            storeClicks({
                id: data.id,
                original_url: data.original_url
            });
        }
    }, [data]);

    if (isLoading) return <div>Redirecting...</div>;
    if (isError) return <div>Link not found</div>;

    return <div>Redirecting...</div>
}

export default RedirectLink