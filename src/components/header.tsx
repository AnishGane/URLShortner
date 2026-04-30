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
import { Loader2, LogOut } from "lucide-react";
import { useAuthContext } from "@/context/auth-context";
import { toast } from "sonner";
import { extractOAuthProfile, getDisplayNameFromEmail } from "@/lib/helper";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
    const navigate = useNavigate();
    const { user, logoutUser, logoutLoading, isAuthenticated } = useAuthContext();
    const email = user?.email;
    const { name, profile_pic } = extractOAuthProfile(user);
    const resolvedProfilePic = profile_pic || user?.user_metadata?.profile_pic || "https://github.com/shadcn.png?s=64";

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
                <Link to={isAuthenticated ? "/dashboard" : "/"}>
                    <h1 className="font-semibold text-2xl">SNiP.</h1>
                </Link>

                <div className="flex gap-2">
                    {!user ? (
                        <>
                            <Button onClick={() => {
                                navigate("/auth");
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                })
                            }}
                                variant="ghost"
                                className={"cursor-pointer px-4 py-4 rounded-md"}>Sign In</Button>
                            <Button onClick={() => {
                                navigate("/auth");
                                window.scrollTo({
                                    top: 0,
                                    behavior: "smooth"
                                })
                            }}
                                className={"cursor-pointer px-4 py-4 rounded-md"}>Sign Up</Button>
                        </>
                    ) : (
                        <div className="flex items-center justify-center gap-4">
                            <ModeToggle />
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <Avatar className={"size-8"}>
                                        <>
                                            <AvatarImage loading="lazy" src={resolvedProfilePic}
                                                sizes="32px" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </>
                                    </Avatar>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className={"mt-1"}>
                                    <DropdownMenuGroup>
                                        <DropdownMenuLabel>{name || user?.user_metadata?.name || (email ? getDisplayNameFromEmail(email) : "User")}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onSelect={(e) =>
                                                e.preventDefault()
                                            }
                                            onClick={handleLogout}
                                            variant="destructive" className={"p-1.5 rounded-sm cursor-pointer"}>
                                            {logoutLoading ? (
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
                        </div>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Header