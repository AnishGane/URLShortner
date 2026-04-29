import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Boxes } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
    const [footerEmail, setFooterEmail] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!footerEmail) {
            toast.error("Please enter your email");
        }
        toast.success("Feature coming soon");
        setFooterEmail("");
    }

    return (
        <footer className="border-t border-border bg-background">
            <div className="max-w-7xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-3">
                {/* Brand Section */}
                <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-xl font-semibold">
                        <img src="/favicon.svg" className="size-7" alt="" />
                        SNiP.
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Simplify your links. Share smarter. <br /> Track better.
                    </p>
                </div>

                {/* Navigation Links */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                        <p className="font-medium">Product</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li className="hover:text-foreground cursor-pointer">Features</li>
                            <li className="hover:text-foreground cursor-pointer">Pricing</li>
                            <li className="hover:text-foreground cursor-pointer">API</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <p className="font-medium">Company</p>
                        <ul className="space-y-1 text-muted-foreground">
                            <li className="hover:text-foreground cursor-pointer">About</li>
                            <li className="hover:text-foreground cursor-pointer">Blog</li>
                            <li className="hover:text-foreground cursor-pointer">Contact</li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="space-y-3">
                    <p className="font-medium">Stay updated</p>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <Input value={footerEmail} onChange={(e) => setFooterEmail(e.target.value)} type="email" className="py-4.5" placeholder="Enter your email" />
                        <Button type="submit" className={"rounded-md cursor-pointer py-4.5 px-4"}>Subscribe</Button>
                    </form>
                    <div className="flex gap-4 pt-2">
                        <Boxes className="size-5 cursor-pointer text-muted-foreground hover:text-foreground" />
                        <Boxes className="size-5 cursor-pointer text-muted-foreground hover:text-foreground" />
                    </div>
                </div>
            </div>

            <Separator />

            {/* Bottom Section */}
            <div className="text-center py-6 text-sm text-muted-foreground">
                © {new Date().getFullYear()} SNiP. Made with ❤️
            </div>
        </footer>
    );
}
