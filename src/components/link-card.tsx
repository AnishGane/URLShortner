import { Check, Copy, EllipsisVertical } from "lucide-react"
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
import { Link } from "react-router-dom"
import { copyToClipboard } from "@/lib/helper"
import { toast } from "sonner"
import EditLinkDialog from "./dialogs/edit-link-dialog"
import ViewQRDialog from "./dialogs/view-qr-dialog"
import { Badge } from "./ui/badge"
import { cn } from "@/lib/utils"

const APP_URL = import.meta.env.VITE_APP_URL;

const LinkCard = ({ url }: { url: any }) => {
    const [isCopied, setIsCopied] = useState(false);

    const copyShortUrl = async () => {
        const success = await copyToClipboard(`${APP_URL}${url.short_url}`);
        if (success) {
            setIsCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setIsCopied(false), 3000);
        }
    }

    return (
        <Card className="pl-1 sm:pl-4 py-4.5 rounded-lg">
            <CardHeader>
                <CardTitle className="text-xl flex items-center justify-between">
                    <Link to={`/link/${url.id}`} onClick={() => window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    })}>
                        <span className="hover:underline">{url.title}</span>
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost" className={"cursor-pointer"}>
                                <EllipsisVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem
                                onClick={copyShortUrl}
                                className={"cursor-pointer rounded-sm py-1.5"}>
                                {!isCopied ?
                                    (
                                        <Copy />
                                    ) : (
                                        <Check />
                                    )}
                                {isCopied ? "Copied" : "Copy Link"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <EditLinkDialog id={url.id} />
                            <DropdownMenuSeparator />
                            <ViewQRDialog qr={url.qr} title={url.title} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardTitle>
                <CardContent className="p-0">
                    {false ? (
                        <div className="h-6 w-40 bg-muted animate-pulse rounded" />
                    ) : (
                        <p className="text-blue-400 text-lg font-medium mt-2">
                            {url.custom_url ? url.custom_url : url.short_url}
                        </p>
                    )}
                    <p>{url.original_url}</p>

                    <div className="flex items-center mt-3 text-xs text-muted-foreground gap-2">
                        <div className="size-[5px] bg-foreground/60 rounded-full" />
                        <div className="flex items-center justify-between w-full">
                            <p>{new Date(url.created_at).toLocaleString()}</p>
                            <Badge className={cn(" text-[10px] tracking-wide text-foreground", url.is_safe ? "bg-green-400/60" : "bg-red-400/70")}>{url.is_safe ? "Safe" : "Unsafe"}</Badge>
                        </div>
                    </div>
                </CardContent>
            </CardHeader>
        </Card>
    )
}

export default React.memo(LinkCard)