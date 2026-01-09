import React from 'react';
import { motion } from 'framer-motion';

interface Collection {
    id: number;
    slug: string;
    name: string;
}

interface CollectionCarouselProps {
    collections: Collection[];
    activeCollection: string;
    onCollectionChange: (collection: string, id?: number) => void;
}

const CollectionCarousel: React.FC<CollectionCarouselProps> = ({
    collections,
    activeCollection,
    onCollectionChange
}) => {
    // Ensure collections is always an array to prevent map errors
    const safeCollections = Array.isArray(collections) ? collections : [];

    return (
        <div className="collection-carousel-container">
            <div className="collection-carousel-wrapper">
                <motion.button
                    className={`collection-pill ${activeCollection === 'all' ? 'active' : ''}`}
                    onClick={() => onCollectionChange('all')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                    All Collections
                </motion.button>
                {safeCollections.map((collection) => (
                    <motion.button
                        key={collection.id}
                        className={`collection-pill ${activeCollection === collection.slug ? 'active' : ''}`}
                        onClick={() => onCollectionChange(collection.slug, collection.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        {collection.name}
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

export default CollectionCarousel;
