import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useState } from "react"

const DeleteAccountDialog = () => {
    const [open, setOpen] = useState(false);
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger>
                <Button variant="destructive" className={"rounded-sm p-5 cursor-pointer"}>Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className={"rounded-md"}>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className={"px-4 py-4.5 cursor-pointer rounded-md"}>No, Leave it</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        toast.success("Delete Account feature will be implemented sooner");
                        setOpen(false);
                    }}
                        className={"px-4 py-4.5 cursor-pointer rounded-md"}>Yes, Delete it</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteAccountDialog