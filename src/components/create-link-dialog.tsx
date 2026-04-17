
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import CreateUrlForm from "./forms/create-url-form";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";

const CreateLinkDialog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const longLink = searchParams.get("createNew");
    const [open, setOpen] = useState(!!longLink);

    return (
        <Dialog open={open} onOpenChange={(res) => {
            setOpen(res);
            if (!res) setSearchParams({});
        }}>
            <DialogTrigger>
                <Button className={"p-4.5 cursor-pointer rounded-md"}>
                    <Plus />
                    Create Link
                </Button>
            </DialogTrigger>
            <DialogContent className={"rounded-md sm:max-w-md py-5"}>
                <DialogHeader>
                    <DialogTitle className={"font-semibold"}>Create New</DialogTitle>
                    <DialogDescription className={"text-[13px]"}>
                        Create a new link by filling up the form.
                    </DialogDescription>

                    <CreateUrlForm setOpen={setOpen} longLink={longLink ?? undefined} />
                </DialogHeader>
            </DialogContent>
        </Dialog >
    )
}

export default CreateLinkDialog