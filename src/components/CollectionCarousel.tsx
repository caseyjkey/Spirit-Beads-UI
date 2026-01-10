import React from 'react';

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
                <button
                    className={`collection-pill ${activeCollection === 'all' ? 'active' : ''}`}
                    onClick={() => onCollectionChange('all')}
                    type="button"
                >
                    All Collections
                </button>
                {safeCollections.map((collection) => (
                    <button
                        key={collection.id}
                        className={`collection-pill ${activeCollection === collection.slug ? 'active' : ''}`}
                        onClick={() => onCollectionChange(collection.slug, collection.id)}
                        type="button"
                    >
                        {collection.name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CollectionCarousel;
