import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { QrCode } from "lucide-react";
import { useState } from "react"
import { Button } from "../ui/button";
import { downloadFile } from "@/lib/helper";
const ViewQRDialog = ({ qr, title }: { qr: string, title: string }) => {
    const [open, setOpen] = useState(false);

    const downloadImage = () => {
        const imageUrl = qr;
        const fileName = title;

        downloadFile(imageUrl, fileName);
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className={"flex items-center px-1.5 hover:bg-muted w-full py-0.5 rounded-sm gap-1.5 cursor-pointer text-[14.5px]"}>
                    <QrCode className="size-4" />
                    View Qr
                </DialogTrigger>
                <DialogContent>
                    <p className="text-center text-lg">{title}</p>
                    <div className="flex items-center justify-center mb-4">
                        <img src={qr} alt="Qr code image" loading="lazy" />
                    </div>
                    <Button onClick={downloadImage} className={"py-5 cursor-pointer"}>Download Qr</Button>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ViewQRDialog