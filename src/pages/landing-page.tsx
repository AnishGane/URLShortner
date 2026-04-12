import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const items = [
    {
        value: "notifications",
        trigger: "Notification Settings",
        content:
            "Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.",
    },
    {
        value: "privacy",
        trigger: "Privacy & Security",
        content:
            "Control your privacy settings and security preferences. Enable two-factor authentication, manage connected devices, review active sessions, and configure data sharing preferences. You can also download your data or delete your account.",
    },
    {
        value: "billing",
        trigger: "Billing & Subscription",
        content:
            "View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
    },
]

const LandingPage = () => {

    const [originalUrl, setOriginalUrl] = useState('')
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (originalUrl) {
            navigate(`/auth?createNew=${originalUrl}`)
        }
    }

    return (
        <section className="text-center px-4 md:px-0 md:pt-40 z-40">

            <h1 className="text-4xl md:text-[6rem] font-semibold">The Only URL Shortner You'll ever Need.</h1>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 md:my-16 w-full md:w-1/2 mx-auto">
                <Input
                    type="url"
                    className="py-5 bg-background border border-foreground/20"
                    value={originalUrl}
                    onChange={(e) => setOriginalUrl(e.target.value)}
                    placeholder="e.g: https://google.com" />
                <Button type="submit" className={"cursor-pointer p-5 w-full sm:w-auto"}>Shorten</Button>
            </form>

            <div className="p-2 rounded-xl bg-foreground/10 shadow-[5px_10px_10px_10px_rgba(0,0,0,0.12)_inset] my-8 md:my-24 ">
                <img src="/LandingPageImage.png" alt="Landing page image" className="w-full rounded-lg object-cover object-top" />
            </div>

            <div className="border-y border-border py-8">
                <h2 className="text-xl md:text-3xl font-medium mb-8">FAQs <span className="text-primary text-sm font-normal">(Frequently Asked Questions)</span></h2>
                <Accordion
                    className="w-full max-w-4xl mx-auto"
                    defaultValue={["notifications"]}
                >
                    {items.map((item) => (
                        <AccordionItem className={"text-left"} key={item.value} value={item.value}>
                            <AccordionTrigger className={"cursor-pointer"}>{item.trigger}</AccordionTrigger>
                            <AccordionContent className={"ml-2"}>{item.content}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}

export default LandingPage