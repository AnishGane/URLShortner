import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => {
    return (
        <div className="space-y-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="animate-pulse h-28 rounded-lg" />
                <Skeleton className="animate-pulse h-28 rounded-lg" />
            </div>

            <div className="flex items-center justify-between my-6">
                <Skeleton className="rounded-lg w-36 h-12" />
                <Skeleton className="rounded-lg w-36 h-12" />
            </div>

            <div className="mb-6">
                <Skeleton className="h-12" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-48 bg-muted animate-pulse rounded" />
                ))}
            </div>
        </div>
    );
};

export default DashboardSkeleton;