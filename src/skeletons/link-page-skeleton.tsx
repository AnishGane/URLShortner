import { Skeleton } from "@/components/ui/skeleton"

export const LinkSkeleton = () => {
    return (
        <div className="flex flex-col py-12 px-2 sm:flex-row gap-8 justify-between">
            <Skeleton className="animate-pulse rounded-lg h-120 sm:w-2/5" />
            <Skeleton className="animate-pulse rounded-lg h-120 sm:w-2/5" />
        </div>
    )
}