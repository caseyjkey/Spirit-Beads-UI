import ProductCard from "./ProductCard";
import CustomOrderDialog from "./CustomOrderDialog";
import CollectionCarousel from "./CollectionCarousel";
import SizeFilter from "./SizeFilter";
import SkeletonCard from "./SkeletonCard";
import { useProducts } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BackToTop from "./BackToTop";

// Define boutique categories
const BOUTIQUE_CATEGORIES = [
  { slug: 'ancestral-motifs', name: 'Ancestral Motifs' },
  { slug: 'infinite-path', name: 'Infinite Path' },
  { slug: 'traditional-rhythms', name: 'Traditional Rhythms' },
  { slug: 'earths-hue', name: 'Earth\'s Hue' },
];

const ProductGrid = () => {
  const { products, loading, loadingMore, error, hasMore, skeletonCount, sentinelRef, setFilteredCount, activeLighterType, setActiveLighterType, setPage, setProducts, setHasMore } = useProducts();
  const [activeCollection, setActiveCollection] = useState('all');
  const [activeSize, setActiveSize] = useState('all');
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handle size filter changes
  const handleSizeChange = (size: string) => {
    setActiveSize(size);

    // Convert size to lighterType parameter
    let lighterType: number | undefined;
    if (size === 'classic') {
      lighterType = 1; // Classic BIC
    } else if (size === 'mini') {
      lighterType = 2; // Mini BIC
    }

    setActiveLighterType(lighterType);
    setPage(1); // Reset to first page
    setProducts([]); // Clear products
    setHasMore(true); // Reset pagination
  };

  // Debug: Track skeletonCount changes
  useEffect(() => {
    console.log('ProductGrid: skeletonCount changed to:', skeletonCount);
  }, [skeletonCount]);

  // Check if carousel is scrolled to end for fade effect
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const checkScrollEnd = () => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 10);
      }
    };

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', checkScrollEnd);
      checkScrollEnd(); // Initial check

      return () => carousel.removeEventListener('scroll', checkScrollEnd);
    }
  }, [activeCollection]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Filter by collection (still client-side since collection filtering isn't implemented in API yet)
    if (activeCollection !== 'all') {
      filtered = filtered.filter(p => p.category === activeCollection);
    }

    // Note: Size filtering is now handled server-side via API lighter_type parameter
    // Classic BIC: lighter_type=1, Mini BIC: lighter_type=2
    return filtered;
  }, [activeCollection, products]);

  if (loading) {
    return (
      <section id="collection" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <Skeleton className="h-4 w-32 mx-auto mb-4" />
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="space-y-4">
                <Skeleton className="aspect-[3/4] w-full rounded-lg" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="collection" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Unable to Load Products
          </h2>
          <p className="font-body text-lg text-muted-foreground mb-8">
            We're having trouble loading our collection. Please try again later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="collection" className="py-20 md:py-28 bg-background relative">
      <div className="container mx-auto px-4">
        {/* Tier 1: Collection Carousel */}
        <div
          ref={carouselRef}
          className={`collection-carousel-container ${isAtEnd ? 'at-end' : ''}`}
        >
          <CollectionCarousel
            collections={BOUTIQUE_CATEGORIES}
            activeCollection={activeCollection}
            onCollectionChange={setActiveCollection}
          />
        </div>

        {/* Tier 2: Size Filter - Full Width */}
        <div className="size-filter-container-compact">
          <SizeFilter
            activeSize={activeSize}
            onSizeChange={handleSizeChange}
          />
        </div>

        {/* Section Header */}
        <div className="text-center mb-0">
          <span className="font-body text-sm uppercase tracking-widest text-accent mb-4 block">
            Handcrafted Collection
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground mb-4">
            Each One Unique
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            Every lighter case is individually crafted with traditional beadwork techniques.
            No two pieces are exactly alike.
          </p>
        </div>

        {/* Product Grid with Animation */}
        <div className="container mx-auto px-4">
          <div
            key={`${activeCollection}-${activeSize}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[400px]"
          >
            {/* Show products */}
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.primary_image || '/placeholder-product.jpg'}
                  pattern={product.pattern_display}
                  lighterType={product.lighter_type_display}
                  isSoldOut={product.is_sold_out}
                />
              </motion.div>
            ))}

            {/* Show skeletons IF loadingMore is true OR skeletonCount > 0 */}
            {(loadingMore || skeletonCount > 0) && (
              [...Array(3)].map((_, i) => (
                <motion.div
                  key={`skeleton-${i}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="text-center mb-4 text-red-500 font-bold relative z-50">
                    LOADING SKELETONS (Page: {Math.ceil(products.length / 24) + 1})
                  </div>
                  <SkeletonCard />
                </motion.div>
              ))
            )}

            {/* Only show "No Lighters Found" if NOT loading and list is empty */}
            {!loadingMore && filteredProducts.length === 0 && skeletonCount === 0 && (
              <motion.div
                className="col-span-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="text-center">
                  <div className="max-w-2xl mx-auto">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                      No Lighters Found
                    </h2>
                    <p className="font-body text-lg text-muted-foreground mb-8">
                      No lighter cases match your current filter selection. Try adjusting your filters to see more of our handcrafted collection.
                    </p>
                    <div className="space-y-4">
                      <p className="font-body text-muted-foreground">
                        Interested in a custom design? We can create a unique piece just for you.
                      </p>
                      <CustomOrderDialog />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* No more products indicator */}
        {!hasMore && products.length > 0 && (
          <div className="text-center mt-12">
            <p className="font-body text-muted-foreground">
              You've reached the end of our collection
            </p>
          </div>
        )}

        {/* Custom Order CTA */}
        <div className="text-center mt-12 md:mt-16">
          <p className="font-body text-muted-foreground mb-4">
            Looking for a custom design or color combination?
          </p>
          <CustomOrderDialog />
        </div>
      </div>

      {/* Sentinel for infinite scroll - positioned at the very end */}
      <div ref={sentinelRef} id="bottom-sentinel" className="w-full h-4" />

      {/* Back to Top Button - positioned relative to this section */}
      <BackToTop />
    </section>
  );
};

export default ProductGrid;
