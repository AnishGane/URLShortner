import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getLongUrl } from "@/db/urls.db";
import { Button } from "@/components/ui/button";

const WarningPage = () => {
    const { id } = useParams();
    if (!id) throw new Error("Missing id");

    const { data } = useQuery({
        queryKey: ["link", id],
        queryFn: () => getLongUrl(id!),
    });

    if (!data) return <div className="items-center justify-center flex pt-4">Loading...</div>;

    return (
        <div className="p-6 text-center">
            <h1>⚠️ Unsafe Link Detected</h1>
            <p>This link may be harmful.</p>

            <div className="mt-4 flex gap-4 justify-center">
                <Button
                    onClick={() =>
                        window.location.replace(data.original_url)
                    }
                    className=" px-8 py-6 bg-red-400 hover:bg-red-500 text-white cursor-pointer"
                >
                    Proceed Anyway
                </Button>

                <Button
                    onClick={() => window.location.href = "/dashboard"}
                    className="py-6 px-8 cursor-pointer"
                >
                    Go Back
                </Button>
            </div>
        </div>
    );
};

export default WarningPage;