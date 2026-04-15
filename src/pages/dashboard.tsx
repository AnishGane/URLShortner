import CreateLinkDialog from "@/components/create-link-dialog";
import LinkCard from "@/components/link-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthContext } from "@/context/auth-context";
import { useClicks } from "@/hooks/useClicks";
import { useDebounce } from "@/hooks/useDebounce";
import { useRealtimeClicks } from "@/hooks/useRealtimeClicks";
import { useRealtimeUrls } from "@/hooks/useRealtimeUrls";
import { useUrls } from "@/hooks/useUrls";
import { Link, Pointer, SearchIcon } from "lucide-react";
import { useState, useMemo } from "react"

const DashboardPage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useAuthContext();
    const userId = user?.id;

    const { data: urls = [], isLoading: urlsLoading } = useUrls(userId);
    const urlIds = useMemo(() => urls.map((u: any) => u.id), [urls]);
    const { data: clicks = [], isLoading: clicksLoading } = useClicks(urlIds);

    const debounceValue = useDebounce(searchQuery, 1000);
    const isTyping = searchQuery !== debounceValue;

    // Realtime sync
    useRealtimeUrls(userId);
    useRealtimeClicks(urlIds);

    const loading = urlsLoading || clicksLoading;

    const filteredUrls = useMemo(() =>
        urls.filter((url: any) =>
            (url.title || "").toLowerCase().includes(debounceValue.toLowerCase())
        ),
        [urls, debounceValue]
    );

    const totalUrls = filteredUrls.length

    return (
        <div className="py-12 px-3">
            {/* Top Stats Card (Dynamic) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                    <>
                        <Skeleton className="animate-pulse h-28 rounded-lg" />
                        <Skeleton className="animate-pulse h-28 rounded-lg" />
                    </>
                ) : (
                    <>
                        <Card className="flex flex-row">
                            <CardHeader className=" flex-1 rounded-none">
                                <CardTitle className="font-normal">Total URLs Created</CardTitle>
                                <Link className="text-muted-foreground/30 size-7" />
                            </CardHeader>
                            <CardContent className="text-xl md:text-5xl font-medium flex items-center justify-center">{urls.length}
                            </CardContent>
                        </Card >
                        <Card className="flex flex-row">
                            <CardHeader className=" flex-1 rounded-none">
                                <CardTitle className="font-normal">Total Clicks
                                    <Pointer className="text-muted-foreground/20 size-7 mt-1" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-xl md:text-5xl font-medium flex items-center justify-center">
                                {clicks.length}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div >

            <div className="flex items-center justify-between my-6" >
                <h1 className="text-3xl font-medium">My Links</h1>
                <CreateLinkDialog />
            </div>

            {/* Search Input field */}
            <div className="mb-6" >
                <InputGroup className=" py-4.5 bg-background">
                    <InputGroupInput id="inline-end-input" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search your links" className="" />
                    <InputGroupAddon align="inline-end" className="mr-1">
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
            </div >

            {urlsLoading ? (
                <Skeleton className="animate-pulse h-12" />
            ) : (
                <div className="my-2 flex items-center gap-4">
                    <div className="flex items-center gap-1">
                        {debounceValue ?
                            <p>Available:</p> :
                            (
                                <p>Total Links:</p>
                            )}
                        <span className="font-medium text-lg">
                            {totalUrls}
                        </span>
                    </div>
                    {isTyping && <p className="text-muted-foreground text-sm">Searching...</p>}
                </div>
            )}

            {/* Rendering the links */}
            {urlsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 bg-muted animate-pulse rounded" />
                    ))}
                </div>
            ) : filteredUrls.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredUrls.map((url) => (
                        <LinkCard key={url.id} url={url} />
                    ))}
                </div>
            ) : (
                <div className="min-h-80 flex items-center justify-center">
                    <p className="text-muted-foreground text-sm">
                        No links created. Create one by tapping on the
                        <span className="text-primary px-1">Create Link</span>
                        button.
                    </p>
                </div>
            )}
        </div >
    )
}

export default DashboardPage