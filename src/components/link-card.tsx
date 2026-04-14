import { Check, Copy, Download, EllipsisVertical, Loader2, QrCode, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import React, { useState } from "react"
import { useURLContext } from "@/context/url-context"

const LinkCard = ({ url }: { url: any }) => {
    const [isCopied, setIsCopied] = useState(false);
    const { loading, deleteUrl } = useURLContext();

    const copyShortUrl = () => {
        navigator.clipboard.writeText(url.short_url);
        setIsCopied(true);
        setTimeout(() => {
            setIsCopied(false);
        }, 3000);
    }

    const downloadImage = () => {
        const imageUrl = url?.qr;
        const fileName = url?.title;

        const anchor = document.createElement("a");
        anchor.href = imageUrl;
        anchor.download = fileName;

        document.body.appendChild(anchor);
        anchor.click();

        document.body.removeChild(anchor);
    }

    return (
        <Card className="px-4 py-4.5 rounded-lg">
            <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                    {url.title}

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost" className={"cursor-pointer"}>
                                <EllipsisVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()} onClick={copyShortUrl}
                                className={"cursor-pointer rounded-sm"}>
                                {!isCopied ?
                                    (
                                        <Copy />
                                    ) : (
                                        <Check />
                                    )}
                                {isCopied ? "Copied" : "Copy Link"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className={"cursor-pointer rounded-sm"}
                                onClick={downloadImage}
                            >
                                <Download />
                                Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className={"cursor-pointer rounded-sm"}>
                                <QrCode />
                                View Qr
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => deleteUrl(url.id)}
                                variant="destructive" className={"cursor-pointer rounded-sm"}>
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 />
                                        Delete
                                    </>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardTitle>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="h-6 w-40 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="underline text-blue-400 text-lg font-medium mt-2">
                            {url.custom_url ? url.custom_url : url.short_url}
                        </p>
                    )}
                    <p>{url.original_url}</p>

                    <div className="flex items-center mt-3 text-xs text-muted-foreground gap-2">
                        <div className="size-[5px] bg-foreground/60 rounded-full" />
                        <p>{new Date(url.created_at).toLocaleString()}</p>
                    </div>
                </CardContent>
            </CardHeader>
        </Card>
    )
}

export default React.memo(LinkCard)