import { getClicksForURLs } from "@/db/clicks.db";
import { getUrls } from "@/db/urls.db";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./auth-context";
import { supabase, supabaseUrl } from "@/db/supabase";

type URLContextType = {
    urls: any[] | null;
    clicks: any[] | null;
    deleteUrl: (UrlId: string) => Promise<void>;
    loading: boolean
    createUrl: ({ title, original_url, custom_url, shortUrl, userId }, qrcode: any,) => Promise<any[]>;
}

const URLContext = createContext<URLContextType | null>(null);

export const URLProvider = ({ children }: { children: React.ReactNode }) => {
    const [urls, setUrls] = useState<any[]>([]);
    const [clicks, setClicks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const { user } = useAuthContext();
    const userId = user?.id;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (!userId) return;

                const fetchedUrls = await getUrls(userId);
                setUrls(fetchedUrls);

                if (fetchedUrls.length > 0) {
                    const fetchedClicks = await getClicksForURLs(fetchedUrls.map((url: any) => url.id));
                    setClicks(fetchedClicks);
                } else {
                    setClicks([]);
                }
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userId])

    const deleteUrl = async (UrlId: string) => {
        setLoading(true);
        try {
            await supabase.from("urls").delete().eq("id", UrlId);
            await supabase.from("clicks").delete().eq("url_id", UrlId);
            setUrls((prev) => prev.filter((url: any) => url.id !== UrlId));
            setClicks((prev) => prev.filter((click: any) => click.url_id !== UrlId));
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    const createUrl = async ({ title, original_url, custom_url, userId }, qrcode: any,) => {
        setLoading(true);
        try {
            const shortUrl = Math.random().toString(36).substring(2, 8);
            const fileName = `qr-${shortUrl}`;
            const { error: storageError } = await supabase.storage.from("qrs").upload(fileName, qrcode);
            if (storageError) {
                setLoading(false);
                throw new Error(storageError.message);
            }

            const qr = `${supabaseUrl}/storage/v1/object/public/qrs/${fileName}`;

            const { data, error } = await supabase.from("urls").insert([
                {
                    title,
                    original_url,
                    short_url: shortUrl,
                    custom_url,
                    qr_code: qr,
                    user_id: userId
                }
            ]).select();

            if (error) {
                setLoading(false);
                throw new Error(error.message || "Unable to create URL");
            }

            setUrls((prev) => [...prev, data[0]])

            return data;
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <URLContext.Provider value={{
            urls, clicks, deleteUrl, loading, createUrl
        }}>
            {children}
        </URLContext.Provider>
    )
}

export const useURLContext = () => {
    const ctx = useContext(URLContext);
    if (!ctx) throw new Error("useURLContext must be used inside URLProvider");
    return ctx;
}