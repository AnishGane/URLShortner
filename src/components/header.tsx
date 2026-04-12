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
import { LinkIcon, LogOut } from "lucide-react";

const Header = () => {
    const navigate = useNavigate();
    const user = false;
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
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className={"mt-1"}>
                                <DropdownMenuGroup>
                                    <DropdownMenuLabel>Anish Gane</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className={"p-1.5 rounded-sm cursor-pointer"}>
                                        <LinkIcon />
                                        My Links
                                    </DropdownMenuItem>
                                    <DropdownMenuItem variant="destructive" className={"p-1.5 rounded-sm cursor-pointer"}>
                                        <LogOut />
                                        Logout
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