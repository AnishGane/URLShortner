import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Faqs from "@/components/faqs"
import { FeatureSection } from "@/components/feature197"
import { features } from "@/constant/data"
import { useTheme } from "@/components/theme-provider"
import SVGLight from "@/assets/SVG1.svg";
import SVGDark from "@/assets/SVG2.svg";

const LandingPage = () => {
    const [originalUrl, setOriginalUrl] = useState('')
    const navigate = useNavigate();
    const { theme } = useTheme();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (originalUrl) {
            navigate(`/auth?createNew=${encodeURIComponent(originalUrl)}`);
        }
    }

    return (
        <section className="px-4 md:px-0 pt-16 md:pt-30 z-40">
            <div className="text-center relative">
                <a target="_blank" href={"https://www.github.com/AnishGane"} className="text-right! font-light underline absolute right-25 -top-4 ">
                    By AnishGane
                </a>
                <h1 className="text-4xl md:text-[6rem] font-semibold leading-10 md:leading-24">The Only URL Shortner You'll ever Need.</h1>
            </div>

            <div className="flex flex-col sm:flex-row justify-center mt-8 md:mt-16 relative">
                <img src={theme === "light" ? SVGDark : SVGLight} alt="Landing page svg image" className="size-28 absolute left-50 -bottom-6 -rotate-32 hidden sm:block select-none pointer-events-none" />
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4  w-full md:w-1/2 mx-auto">
                    <Input
                        type="url"
                        className="py-5 bg-background! border border-foreground/20"
                        value={originalUrl}
                        onChange={(e) => setOriginalUrl(e.target.value)}
                        placeholder="e.g: https://www.google.com" />
                    <Button type="submit" className={"cursor-pointer rounded-md p-5 w-full sm:w-auto"}>Shorten</Button>
                </form>
            </div>

            <div className="p-2 rounded-xl bg-foreground/10 shadow-[5px_10px_10px_10px_var(--foreground/20)_inset] mask-b-from-60% sm:mask-b-from-70% my-8 md:my-16">
                <img src={theme === "light" ? "/images/LandingPageLight.png" : "/images/LandingPageDark.png"} alt="Landing page image" className="w-full rounded-lg object-cover object-top select-none pointer-events-none" />
            </div>

            <FeatureSection features={features} />

            <Faqs />
        </section>
    )
}

export default LandingPage