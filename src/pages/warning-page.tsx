import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLongUrl } from "@/db/urls.db";
import { Button } from "@/components/ui/button";

const WarningPage = () => {
    const { id } = useParams();

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["link", id],
        queryFn: () => getLongUrl(id as string),
        enabled: Boolean(id),
    });

    if (!id) return <div className="items-center justify-center flex pt-4">Missing link id</div>;
    if (isLoading) return <div className="items-center justify-center flex pt-4">Loading...</div>;
    if (isError || !data) return <div className="items-center justify-center flex pt-4">Link not found</div>;

    const isSafeUrl = (url: string) => {
        try {
            const parsedUrl = new URL(url);
            return ["http:", "https:"].includes(parsedUrl.protocol) && Boolean(parsedUrl.hostname);
        } catch {
            return false;
        }
    }

    return (
        <div className="p-6 text-center">
            <h1>⚠️ Unsafe Link Detected</h1>
            <p>This link may be harmful.</p>
            {error && <p className="text-destructive mt-2">{error?.message ?? "Error fetching link"}</p>}

            <div className="mt-4 flex gap-4 justify-center">
                <Button
                    onClick={() => {
                        if (isSafeUrl(data.original_url)) {
                            window.location.replace(data.original_url);
                        }
                    }}
                    className=" px-8 py-6 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                >
                    Proceed Anyway
                </Button>

                <Button
                    onClick={() => window.location.replace("/dashboard")}
                    className="py-6 px-8 cursor-pointer"
                >
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default WarningPage;
