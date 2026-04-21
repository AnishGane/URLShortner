"use client";

import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ArrowRightFromLine } from "lucide-react";

interface FeatureItem {
  id: number;
  title: string;
  image: string;
  description: string;
}

interface Feature197Props {
  features: FeatureItem[];
  className?: string;
}

const FeatureSection = ({
  features,
  className,
}: Feature197Props) => {
  const [activeTabId, setActiveTabId] = useState<number | null>(features[0]?.id ?? null);
  const [activeImage, setActiveImage] = useState(features[0]?.image ?? "");

  if (features.length === 0) {
    return null;
  }

  return (
    <section className={cn("py-8 sm:py-16", className)}>
      <div className="container mx-auto">
        <h2 className="text-xl md:text-3xl font-medium mb-8 sm:mb-12">Features</h2>
        <div className="flex w-full items-start justify-between gap-12">
          <div className="w-full md:w-1/2">
            <Accordion
              className="w-full"
              defaultValue={[`item-${features[0].id}`]}
            >
              {features.map((tab) => (
                <AccordionItem
                  key={tab.id}
                  value={`item-${tab.id}`}
                >
                  <AccordionTrigger
                    onClick={() => {
                      setActiveImage(tab.image);
                      setActiveTabId(tab.id);
                    }}
                    className="cursor-pointer py-4 transition"
                  >
                    <h4
                      className={`text-sm sm:text-base ${tab.id === activeTabId ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {tab.title}
                    </h4>
                  </AccordionTrigger>
                  <AccordionContent className="pb-2">
                    <div className="flex gap-2">
                      <ArrowRightFromLine className="text-foreground/80" />
                      <p className="text-sm tracking-wide text-left text-foreground/70">
                        {tab.description}
                      </p>
                    </div>
                    <div className="mt-4 md:hidden">
                      <img
                        src={tab.image}
                        alt={tab.title}
                        className="h-full max-h-80 select-none pointer-events-none w-full rounded-md object-cover"
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="relative hidden w-1/2 overflow-hidden rounded-xl bg-muted md:block">
            <div className="relative aspect-4/3">
              {features.map((feature) => (
                <img
                  key={feature.id}
                  src={feature.image}
                  alt={feature.title}
                  className={cn(
                    "absolute inset-0 h-full w-full select-none pointer-events-none rounded-md object-cover transition-opacity duration-500",
                    activeImage === feature.image ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { FeatureSection };
