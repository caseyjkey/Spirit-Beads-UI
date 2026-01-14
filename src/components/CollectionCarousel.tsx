import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [needsChevrons, setNeedsChevrons] = useState(false);

    // Check if we're on desktop
    const [isDesktop, setIsDesktop] = useState(false);
    const carouselRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Ensure collections is always an array to prevent map errors
    const safeCollections = Array.isArray(collections) ? collections : [];

    // Check if we're on desktop
    useEffect(() => {
        const checkDesktop = () => {
            setIsDesktop(window.innerWidth >= 768);
        };

        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    // Check if chevrons are needed (content overflows)
    useEffect(() => {
        const checkOverflow = () => {
            if (carouselRef.current && isDesktop) {
                const { scrollWidth, clientWidth } = carouselRef.current;
                const hasOverflow = scrollWidth > clientWidth + 1 || safeCollections.length > 3;
                setNeedsChevrons(hasOverflow);
            } else {
                setNeedsChevrons(false);
            }
        };

        // Check after initial render and on resize
        checkOverflow();
        window.addEventListener('resize', checkOverflow, { passive: true });

        return () => {
            window.removeEventListener('resize', checkOverflow);
        };
    }, [isDesktop, safeCollections]);

    // Check scroll position for chevron visibility
    useEffect(() => {
        const checkScroll = () => {
            if (carouselRef.current && isDesktop) {
                const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                const newCanScrollLeft = scrollLeft > 0;
                const newCanScrollRight = scrollLeft < scrollWidth - clientWidth - 1;

                setCanScrollLeft(newCanScrollLeft);
                setCanScrollRight(newCanScrollRight);
            }
        };

        const carousel = carouselRef.current;
        if (carousel && isDesktop) {
            carousel.addEventListener('scroll', checkScroll, { passive: true });
            checkScroll(); // Initial check

            // Also check on window resize
            window.addEventListener('resize', checkScroll, { passive: true });

            return () => {
                carousel.removeEventListener('scroll', checkScroll);
                window.removeEventListener('resize', checkScroll);
            };
        }
    }, [isDesktop, safeCollections]);

    // Update gradient visibility classes based on scroll state
    useEffect(() => {
        if (containerRef.current && isDesktop) {
            if (canScrollLeft) {
                containerRef.current.classList.add('can-scroll-left');
            } else {
                containerRef.current.classList.remove('can-scroll-left');
            }

            if (canScrollRight) {
                containerRef.current.classList.add('can-scroll-right');
            } else {
                containerRef.current.classList.remove('can-scroll-right');
            }
        }
    }, [canScrollLeft, canScrollRight, isDesktop]);

    const scrollLeft = () => {
        if (carouselRef.current) {
            const pills = carouselRef.current.querySelectorAll('.collection-pill') as NodeListOf<HTMLElement>;
            const currentScrollLeft = carouselRef.current.scrollLeft;
            const containerWidth = carouselRef.current.clientWidth;

            // Slide out left gradient (only if visible)
            if (containerRef.current && canScrollLeft) {
                containerRef.current.classList.add('gradient-fade-left');
                setTimeout(() => {
                    containerRef.current?.classList.remove('gradient-fade-left');
                }, 200);
            }

            // Find the first pill that's currently fully visible
            let firstFullyVisibleIndex = -1;
            let targetScroll = 0;

            for (let i = 0; i < pills.length; i++) {
                const pill = pills[i];
                const pillLeft = pill.offsetLeft;
                const pillRight = pillLeft + pill.offsetWidth;

                // Check if this pill is fully visible
                const isFullyVisible = pillLeft >= currentScrollLeft && pillRight <= currentScrollLeft + containerWidth;

                if (isFullyVisible && firstFullyVisibleIndex === -1) {
                    firstFullyVisibleIndex = i;
                }

                // Find the first pill that's not fully visible (to scroll to)
                if (pillRight > currentScrollLeft) {
                    targetScroll = Math.max(0, pillLeft - 20); // 20px padding
                    break;
                }
            }

            // Edge case: If the first fully visible pill is the first pill (index 0),
            // scroll to the very beginning
            if (firstFullyVisibleIndex === 0) {
                targetScroll = 0;
            }

            // If the calculated target is behind our current position, scroll to 0
            if (targetScroll < currentScrollLeft) {
                targetScroll = 0;
            }

            carouselRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });

            // Manually trigger scroll check after a short delay to ensure state updates
            setTimeout(() => {
                if (carouselRef.current && isDesktop) {
                    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                    setCanScrollLeft(scrollLeft > 0);
                    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
                }
            }, 150);
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            const pills = carouselRef.current.querySelectorAll('.collection-pill') as NodeListOf<HTMLElement>;
            const currentScrollLeft = carouselRef.current.scrollLeft;
            const containerWidth = carouselRef.current.clientWidth;

            // Slide out right gradient (only if visible)
            if (containerRef.current && canScrollRight) {
                containerRef.current.classList.add('gradient-fade-right');
                setTimeout(() => {
                    containerRef.current?.classList.remove('gradient-fade-right');
                }, 200);
            }

            // Find first pill that's not fully visible
            for (let i = 0; i < pills.length; i++) {
                const pill = pills[i];
                const pillLeft = pill.offsetLeft;
                const pillRight = pillLeft + pill.offsetWidth;

                if (pillRight > currentScrollLeft + containerWidth) {
                    // This pill is the next one to scroll to
                    const targetScroll = pillLeft - 20; // 20px padding
                    carouselRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });

                    // Manually trigger scroll check after a short delay to ensure state updates
                    setTimeout(() => {
                        if (carouselRef.current && isDesktop) {
                            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                            setCanScrollLeft(scrollLeft > 0);
                            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
                        }
                    }, 100);
                    return;
                }
            }

            // If we're here, scroll to the end
            carouselRef.current.scrollTo({ left: carouselRef.current.scrollWidth, behavior: 'smooth' });

            // Manually trigger scroll check after a short delay to ensure state updates
            setTimeout(() => {
                if (carouselRef.current && isDesktop) {
                    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
                    setCanScrollLeft(scrollLeft > 0);
                    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
                }
            }, 100);
        }
    };

    return (
        <div ref={containerRef} className={`collection-carousel-container ${needsChevrons ? 'has-chevrons' : ''}`}>
            {/* Left Chevron - Desktop Only */}
            {needsChevrons && canScrollLeft && (
                <button
                    onClick={scrollLeft}
                    className="collection-chevron collection-chevron-left"
                    type="button"
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>
            )}

            <div
                ref={carouselRef}
                className={`collection-carousel-wrapper ${isDesktop && needsChevrons ? 'has-chevrons' : ''}`}
            >
                {/* Collection Pills */}
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

            {/* Right Chevron - Desktop Only */}
            {isDesktop && needsChevrons && canScrollRight && (
                <button
                    onClick={scrollRight}
                    className="collection-chevron collection-chevron-right"
                    type="button"
                    aria-label="Scroll right"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
            )}
        </div>
    );
};

export default CollectionCarousel;
