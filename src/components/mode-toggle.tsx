import { Monitor, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useState } from "react"


export function ModeToggle() {
    const { setTheme } = useTheme()
    const [themeActive, setThemeActive] = useState("light");

    return (
        <div className="border border-border rounded-full px-1 py-0.5">
            <Button size="sm" variant={themeActive === "light" ? "default" : "ghost"} className={"rounded-full cursor-pointer"} onClick={() => {
                setTheme("light");
                setThemeActive("light");
            }}>
                <Sun />
            </Button>
            <Button size="sm" variant={themeActive === "dark" ? "default" : "ghost"} className={"rounded-full cursor-pointer"} onClick={() => { setTheme("dark"); setThemeActive("dark"); }}>
                <Moon />
            </Button>
            <Button size="sm" variant={themeActive === "system" ? "default" : "ghost"} className={"rounded-full cursor-pointer"} onClick={() => { setTheme("system"); setThemeActive("system"); }}>
                <Monitor />
            </Button>
        </div>
    )
}