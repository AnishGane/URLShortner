const DashboardSkeleton = () => {
    return (
        <div className="space-y-4 mt-4">
            <div className="h-6 w-40 bg-muted animate-pulse rounded" />
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />

            <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-muted animate-pulse rounded" />
                ))}
            </div>
        </div>
    );
};

export default DashboardSkeleton;