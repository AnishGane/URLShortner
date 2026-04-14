import LocationStatsChart from "@/components/location-stats-chart";
import DevicePieChart from "@/components/pie-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/context/auth-context";
import { getClicksForaURL } from "@/db/clicks.db";
import { getUrl } from "@/db/urls.db";
import { LinkSkeleton } from "@/skeletons/link-page-skeleton";
import { useQuery } from "@tanstack/react-query";
import { Copy, Download, Link, Loader2, Trash2 } from "lucide-react";
import { useParams } from "react-router-dom"

const APP_URL = import.meta.env.VITE_APP_URL;

const LinkPage = () => {
  const { id } = useParams();
  const { user } = useAuthContext();

  const { isLoading, data: url, isError } = useQuery({
    queryKey: ["linkurl", id, user?.id],
    queryFn: () => getUrl(id, user?.id || ""),
    enabled: !!id && !!user
  })

  const { isLoading: clicksLoading, data: clicksStats, isError: clicksError } = useQuery({
    queryKey: ["urlClicks"],
    queryFn: () => getClicksForaURL(id),
    enabled: !!id
  })

  let link = "";
  if (url) {
    link = url?.custom_url ? url?.custom_url : url?.short_url
  }

  // delete Url logic and copy, download all here

  if (isLoading || clicksLoading) return <LinkSkeleton />

  if (isError || clicksError) return <div className="min-h-screen flex justify-center items-center text-2xl">Oops! Something went wrong. Try Again later.</div>

  return (
    <section className="flex flex-col py-12 sm:flex-row gap-6 justify-between px-4 sm:px-0">
      <Card className="flex flex-col items-start gap-4 rounded-lg sm:w-2/5 h-fit">
        <CardHeader className="w-full px-4 flex justify-between items-center">
          <CardTitle className="text-xl md:text-2xl w-fit">
            {url?.title}
          </CardTitle>
          <CardDescription className="text-xs">
            Created at: {new Date(url?.created_at).toLocaleString()}
          </CardDescription>
        </CardHeader>
        <Separator />
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-medium">Short Link</h2>
            <div className="flex items-center gap-2">
              <Link className="size-3.5" />
              <a className="text-blue-400 hover:underline" href={`${APP_URL}${link}`} target="_blank">
                {APP_URL}{link}
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-1 my-1">
            <h2 className="text-lg font-medium">Original Link</h2>
            <div className="flex items-center gap-2">
              <Link className="size-3.5" />
              <a href={`${url?.original_url}`} target="_blank">
                {url?.original_url}
              </a>
            </div>
          </div>

          <div >
            <h2 className="text-lg font-medium">QR Code</h2>
            <div className="border-4 border-foreground mt-1 w-fit">
              <img src={`${url?.qr}?s=32`} alt="qr code" loading="lazy" />
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <h2 className="text-base">You can also</h2>
            <div className="flex items-center gap-2">
              <Button title="Copy short url" className={"cursor-pointer rounded-md px-3.5 py-4.5"}>
                <Copy />
                <span className="sr-only">Copy short url</span>
              </Button>
              <Button title="Delete link" variant="destructive" className={"cursor-pointer rounded-md px-3.5 py-4.5"}>
                <Trash2 />
                <span className="sr-only">Delete link</span>
              </Button>
              <Button title="Download qr code" variant="outline" className={"cursor-pointer rounded-md px-3.5 py-4.5"}>
                <Download />
                <span className="sr-only">Download qr code</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
      {/* Analytics */}
      <Card className="flex-1 rounded-lg">
        {clicksStats && clicksStats?.length > 0 ? (
          <CardContent className="space-y-4">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle>
                  Total Clicks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{clicksStats?.length}</p>
              </CardContent>
            </Card>
            <LocationStatsChart stats={clicksStats} />
            <DevicePieChart stats={clicksStats} />
          </CardContent>
        ) : (
          <CardContent>
            {clicksLoading ? (
              <>
                <Loader2 className="animate-spin" />
                <p>Loading Analytics</p>
              </>
            ) : (
              <div className="text-muted-foreground h-80 flex items-center justify-center">
                <p>No Analytics Found</p>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </section>
  )
}

export default LinkPage