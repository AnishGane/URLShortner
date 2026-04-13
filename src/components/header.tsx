import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, Loader2, LogOut } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";
import { toast } from "sonner";

const Header = () => {
    const navigate = useNavigate();
    const { user, logoutUser, loading } = useAuthContext();

    const getDisplayNameFromEmail = (email: string) => {
        const upperCaseEmail = email.charAt(0).toUpperCase() + email.slice(1).replace(/[0-9]/g, '');
        const parts = upperCaseEmail.split("@");
        return parts[0];
    }

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/");
        } catch (error) {
            console.log(error);
            toast.error("Error logging out");
        }
    }

    return (
        <header className="sticky top-0 border-b border-b-border/60 z-30 bg-background/20 backdrop-blur-2xl">
            <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
                <Link to={"/"}>
                    <h1 className="font-semibold text-2xl">URLShortner</h1>
                </Link>

                <div className="flex gap-2">
                    {!user ? (
                        <>
                            <Button onClick={() => navigate("/auth")} className={"cursor-pointer px-4 py-4 rounded-md"}>Sign In</Button>
                            <Button variant="outline" onClick={() => navigate("/auth")} className={"cursor-pointer px-4 py-4 rounded-md"}>Sign Up</Button>
                        </>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    {user?.user_metadata?.profile_pic ? (
                                        <>
                                            <AvatarImage src={user?.user_metadata?.profile_pic} />
                                            <AvatarFallback>URL</AvatarFallback>
                                        </>
                                    ) : (
                                        <>
                                            <AvatarImage src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </>
                                    )}
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className={"mt-1"}>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>{user?.user_metadata?.name || getDisplayNameFromEmail(user.email)}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className={"p-1.5 rounded-sm cursor-pointer"}>
                                        <LinkIcon />
                                        My Links
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onPointerDown={(e) => e.preventDefault()}
                                        onSelect={(e) => {
                                            e.preventDefault(); handleLogout()
                                        }} variant="destructive" className={"p-1.5 rounded-sm cursor-pointer"}>
                                        {loading ? (
                                            <>
                                                <Loader2 className="animate-spin" />
                                                <span className="line-clamp-1">Logging out...</span>
                                            </>) : (
                                            <>
                                                <LogOut />
                                                Logout
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Header