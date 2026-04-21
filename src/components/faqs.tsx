import { FAQS } from "@/constant/data"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import { useState } from "react";

const Faqs = () => {
    const defaultFaq = FAQS[0];
    const [activeTabId, setActiveTabId] = useState<number | null>(defaultFaq?.id ?? null);

    const handleValueChange = (value: string[]) => {
        const openItem = FAQS.find((item) => value.includes(item.value));
        setActiveTabId(openItem?.id ?? null);
    };

    return (
        <div className="py-4 sm:py-8">
            <h2 className="text-xl md:text-3xl font-medium mb-8">FAQs <span className="text-primary text-sm font-normal">(Frequently Asked Questions)</span></h2>
            <Accordion
                className="w-full max-w-4xl mx-auto"
                defaultValue={defaultFaq ? [defaultFaq.value] : []}
                onValueChange={handleValueChange}
            >
                {FAQS.map((item) => (
                    <AccordionItem
                        className={"text-left"}
                        key={item.id}
                        value={item.value}>
                        <AccordionTrigger className={"cursor-pointer text-base"}>
                            <h4
                                className={`text-sm sm:text-base ${item.id === activeTabId ? "text-foreground" : "text-muted-foreground"}`}
                            >
                                {item.trigger}
                            </h4>
                        </AccordionTrigger>
                        <AccordionContent className={"ml-2"}>{item.content}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}

export default Faqs