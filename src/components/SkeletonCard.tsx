import { motion } from 'framer-motion';

const SkeletonCard = () => {
    return (
        <motion.div
            className="space-y-4 border-2 border-red-500 bg-white p-4 rounded-lg" // Added background and padding
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Skeleton Image */}
            <div className="skeleton-box skeleton-image" />

            {/* Skeleton Text */}
            <div className="space-y-2">
                <div className="skeleton-box skeleton-text" />
                <div className="skeleton-box skeleton-price" />
            </div>
        </motion.div>
    );
};

export default SkeletonCard;
