import CreateLinkDialog from "@/components/create-link-dialog";
import LinkCard from "@/components/link-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useAuthContext } from "@/context/auth-context";
import { useClicks } from "@/hooks/useClicks";
import { useRealtimeClicks } from "@/hooks/useRealtimeClicks";
import { useRealtimeUrls } from "@/hooks/useRealtimeUrls";
import { useUrls } from "@/hooks/useUrls";
import DashboardSkeleton from "@/skeletons/dashboard-skeleton";
import { SearchIcon } from "lucide-react";
import { useState, useMemo } from "react"

const DashboardPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useAuthContext();
    const userId = user?.id;

    const { data: urls = [], isLoading: urlsLoading } = useUrls(userId);
    const urlIds = useMemo(() => urls.map((u: any) => u.id), [urls]);
    const { data: clicks = [], isLoading: clicksLoading } = useClicks(urlIds);

    // Realtime sync
    useRealtimeUrls(userId);
    useRealtimeClicks(urlIds);

    const loading = urlsLoading || clicksLoading;

    const filteredUrls = useMemo(() =>
        urls.filter((url: any) =>
            (url.title || "").toLowerCase().includes(searchQuery.toLowerCase())
        ),
        [urls, searchQuery]
    );

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="my-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Total URLs Created</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{urls.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Total Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{clicks.length}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between my-6">
                <h1 className="text-3xl font-medium">My Links</h1>
                <CreateLinkDialog />
            </div>

            {/* Rendering the links */}
            <div>
                <InputGroup className="mb-4 py-4.5 bg-background">
                    <InputGroupInput id="inline-end-input" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search your links" className="" />
                    <InputGroupAddon align="inline-end" className="mr-1">
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {filteredUrls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUrls.map((url) => (
                        <LinkCard key={url.id} url={url} />
                    ))}
                </div>
            ) : (
                <div className="min-h-80 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                        No links created. Create one by tapping on the
                        <span className="text-primary px-1">
                            Create Link
                        </span>
                        button.
                    </p>
                </div>
            )}
        </div>
    )
}

export default DashboardPage