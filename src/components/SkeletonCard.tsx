interface SkeletonCardProps {
    /** When true, renders without framer-motion animation (for use in crossfade overlay) */
    static?: boolean;
}

const SkeletonCard = ({ static: isStatic = false }: SkeletonCardProps) => {
    const content = (
        <>
            {/* Skeleton Image - matches ProductCard aspect ratio 4/5 with shimmer */}
            <div className="skeleton-shimmer" style={{ aspectRatio: '4 / 5' }} />

            {/* Skeleton Text - matches ProductCard p-4 spacing */}
            <div className="p-4 space-y-2">
                <div className="h-3 w-16 skeleton-shimmer rounded" />
                <div className="h-5 w-3/4 skeleton-shimmer rounded" />
                <div className="h-5 w-20 skeleton-shimmer rounded" />
            </div>
        </>
    );

    if (isStatic) {
        return (
            <div className="bg-card rounded-lg overflow-hidden shadow-soft h-full">
                {content}
            </div>
        );
    }

    return (
        <div className="bg-card rounded-lg overflow-hidden shadow-soft">
            {content}
        </div>
    );
};

export default SkeletonCard;
