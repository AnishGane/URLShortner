import { Skeleton } from "@/components/ui/skeleton"

export const LinkSkeleton = () => {
    return (
        <div className="flex flex-col py-12 px-2 sm:flex-row gap-8 min-h-screen justify-between">
            <Skeleton className="animate-pulse rounded-lg h-160 sm:w-2/5 flex-1" />
            <Skeleton className="animate-pulse rounded-lg h-180 sm:w-2/5 flex-1" />
        </div>
    )
}