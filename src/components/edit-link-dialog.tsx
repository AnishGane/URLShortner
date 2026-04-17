import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { getUrl } from "@/db/urls.db"
import { useQuery } from "@tanstack/react-query"
import { Pencil } from "lucide-react"
import { EditLinkForm } from "./forms/edit-link-form"
import { useState } from "react"

const EditLinkDialog = ({ id }: { id: string }) => {
    const [open, setOpen] = useState(false);

    const { data: url } = useQuery({
        queryKey: ["urls", id],
        queryFn: () => {
            if (!id) {
                throw new Error("Missing id");
            }
            return getUrl(id);
        },
        enabled: !!id,
    });

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className={"flex items-center px-1.5 hover:bg-muted w-full py-0.5 rounded-sm gap-1.5 cursor-pointer text-[14.5px]"}>
                    <Pencil className="size-4" />
                    Edit Link
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update Link</DialogTitle>
                        {url
                            ? <EditLinkForm url={url} setOpen={setOpen} />
                            : <div className="mt-4 text-center text-sm text-muted-foreground">Loading...</div>}
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EditLinkDialog