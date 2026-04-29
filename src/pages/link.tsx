import LocationStatsChart from "@/components/charts/location-stats-chart";
import DevicePieChart from "@/components/charts/pie-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/context/auth-context";
import { getClicksForaURL } from "@/db/clicks.db";
import { getUrl } from "@/db/urls.db";
import { useDeleteUrl } from "@/hooks/useDeleteUrl";
import { copyToClipboard, downloadFile, shareLink } from "@/lib/helper";
import { LinkSkeleton } from "@/skeletons/link-page-skeleton";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Copy, Download, Link, Loader2, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom"
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const APP_URL = import.meta.env.VITE_APP_URL;

const LinkPage = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const [isCopied, setIsCopied] = useState(false);
  const { mutate: deleteUrl, isPending, isSuccess } = useDeleteUrl();

  if (!id) {
    return <div>Invalid Id</div>
  }

  const { isLoading, data: url, isError } = useQuery({
    queryKey: ["linkurl", id, user?.id],
    queryFn: () => {
      if (!user?.id) {
        throw new Error("Missing user");
      }
      return getUrl(id);
    },
    enabled: !!id && !!user?.id,
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

  const copyShortUrl = async () => {
    const success = await copyToClipboard(`${APP_URL}${link}`);
    if (success) {
      setIsCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setIsCopied(false), 3000);
    }
  }

  const downloadImage = () => {
    if (!url?.qr) return;
    const imageUrl = url?.qr;
    const fileName = url?.title;

    downloadFile(imageUrl, fileName);
  }

  if (isLoading || clicksLoading) return <LinkSkeleton />

  if (isError || clicksError) return <div className="min-h-screen flex justify-center items-center text-2xl">Oops! Something went wrong. Try Again later.</div>

  if (isSuccess) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <section className="py-6 sm:py-8 px-3">
      <Button onClick={() => window.history.back()} variant="outline" className={"cursor-pointer"}>
        <ArrowLeft />
      </Button>
      <div className="flex flex-col mt-6 sm:flex-row gap-6 justify-between">
        <Card className="flex flex-col items-start gap-4 rounded-lg sm:w-2/5 h-fit">
          <CardHeader className="w-full px-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <CardTitle className="text-xl md:text-2xl w-fit">
              {url?.title}
            </CardTitle>
            <CardDescription className="text-xs">
              Created at: {url?.created_at ? new Date(url.created_at).toLocaleString() : "Unknown"}
            </CardDescription>
          </CardHeader>
          <Separator />
          <div className="flex flex-col gap-4 p-4">
            <div className="flex flex-col">
              <h2 className="text-lg font-medium">
                {url?.custom_url ? "Custom Short Link" : "Short Link"}
              </h2>
              <div className="flex items-center gap-2">
                <Link className="size-3.5" />
                <a className="text-blue-400 hover:underline" href={`${APP_URL}${link}`} target="_blank" rel="noopener noreferrer">
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
                <Button title="Copy short url"
                  onClick={copyShortUrl}
                  className={"cursor-pointer rounded-md px-3.5 py-4.5"}>
                  {isCopied ? <Check /> : <Copy />}
                  <span className="sr-only">Copy short url</span>
                </Button>
                <Button title="Download qr code" variant="outline"
                  onClick={downloadImage}
                  className={"cursor-pointer rounded-md px-3.5 py-4.5"}>
                  <Download />
                  <span className="sr-only">Download qr code</span>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Button disabled={isPending} title="Delete link" variant="destructive"
                      className={"cursor-pointer rounded-md px-3.5 py-4.5"}>
                      {isPending ?
                        <Loader2 className="animate-spin size-5" /> :
                        <Trash2 />
                      }
                      <span className="sr-only">Delete link</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure about it?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You are deleting <strong className="underline font-semibold">
                          {url?.title}
                        </strong>. This action cannot be undone. This will permanently delete your link from our server.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="flex items-center justify-between gap-2">
                      <AlertDialogCancel className={"flex-1 rounded-sm py-4.5 cursor-pointer"}>No, Keep it</AlertDialogCancel>
                      <AlertDialogAction disabled={isPending} className={"flex-1 rounded-sm py-4.5 cursor-pointer"} onClick={() => deleteUrl(url?.id)}>
                        {isPending ? "Deleting..." : "Yes, Delete"}
                      </AlertDialogAction>
                    </div>
                  </AlertDialogContent>
                </AlertDialog>
                <Button title="Share link" variant="secondary"
                  onClick={() => shareLink(`${APP_URL}${link}`)}
                  className={"cursor-pointer rounded-md px-3.5 py-4.5"}>
                  <Share2 />
                  <span className="sr-only">Share this link</span>
                </Button>
              </div>
            </div>
            {!url?.is_safe && <p className="mt-4">Risk reason: {url?.risk_reason || "Unknown reason"} ({url?.is_safe ? "Safe Link" : "Unsafe Link"})</p>}
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
                <div className="flex items-center justify-center h-60">
                  <Loader2 className="animate-spin mr-2" />
                  <p>Loading Analytics</p>
                </div>
              ) : (
                <div className="text-muted-foreground h-80 flex items-center justify-center">
                  <p>No Analytics Found</p>
                </div>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </section>
  )
}

export default LinkPage