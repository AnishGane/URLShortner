import type { Faq, Feature } from "@/types";

export const FAQS: Faq[] = [
  {
    id: 1,
    value: "what-is-url-shortener",
    trigger: "What is a URL Shortener?",
    content:
      "A URL shortener transforms long, unwieldy links into short, easy-to-share URLs. This service makes links more manageable, trackable, and visually appealing—perfect for social media, marketing campaigns, or whenever you need a concise link.",
  },
  {
    id: 2,
    value: "how-does-it-work",
    trigger: "How does URL shortening work?",
    content:
      "When you submit a long URL, our platform creates a unique short code and stores the mapping in our database. Anyone using the short link will be instantly redirected to your original URL. All click activity can be tracked for analytics purposes.",
  },
  {
    id: 3,
    value: "is-it-free",
    trigger: "Is this service free?",
    content:
      "Yes! Our URL shortening service is completely free to use. Just paste your long URL, get a short one instantly, and track your analytics hassle-free. No signup is required for basic use.",
  },
  {
    id: 4,
    value: "can-i-customize",
    trigger: "Can I customize my short links?",
    content:
      "Absolutely. After signing up, you can choose your own custom alias for each shortened URL (if available), making them even more memorable and brandable.",
  },
  {
    id: 5,
    value: "how-to-track",
    trigger: "How can I see clicks or analytics?",
    content:
      "Log into your dashboard to view real-time analytics for every link you create, including the number of clicks, device types, location stats, and more.",
  },
];

export const features: Feature[] = [
  {
    id: 1,
    title: "Search your Links",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw12.jpeg",
    description:
      "With our search feature, you can easily find the link you're looking for. Just type in the search bar and let the magic happen.",
  },
  {
    id: 2,
    title: "Create, Edit, and Delete Links",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw15.jpeg",
    description:
      "Create, edit, and delete links effortlessly. Our user-friendly interface makes it simple to manage your links.",
  },
  {
    id: 3,
    title: "Dark Mode & Customization",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw20.jpeg",
    description:
      "Every block supports dark mode out of the box and can be customized to match your brand. Modify colors, spacing, and typography using Tailwind's configuration.",
  },
  {
    id: 4,
    title: "Track the Clicks and Analytics",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/lummi/bw21.jpeg",
    description:
      "Track the number of clicks, device types, location stats, and more. Our analytics dashboard gives you real-time insights into your link performance.",
  },
];
