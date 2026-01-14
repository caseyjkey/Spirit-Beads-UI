import ProductCard from "./ProductCard";
import CustomOrderDialog from "./CustomOrderDialog";
import CollectionCarousel from "./CollectionCarousel";
import SizeFilter from "./SizeFilter";
import SkeletonCard from "./SkeletonCard";
import { useProducts, useCategories } from "@/hooks/use-api";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import BackToTop from "./BackToTop";
import { useHeaderState } from "@/hooks/use-header-state";

const ProductGrid = ({ isAboutSectionVisible }: { isAboutSectionVisible: boolean }) => {
  const { products, loading, loadingMore, showSkeletons, error, hasMore, skeletonCount, filteredCount, setFilteredCount, activeLighterType, setActiveLighterType, activeCategory, setActiveCategory, setupObserver, setPage, setProducts, setHasMore } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const { status } = useHeaderState();
  const [activeCollection, setActiveCollection] = useState('all');
  const [activeSize, setActiveSize] = useState('all');
  const carouselRef = useRef<HTMLDivElement>(null);

  // Note: Infinite scroll is now managed by the scroll functions in Header/Hero
  // which disconnect before scrolling and re-enable after scroll completes

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

    // Wait for DOM to settle (products may be loading)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const collectionSection = document.getElementById('collection');
        if (collectionSection) {
          const rect = collectionSection.getBoundingClientRect();
          if (rect.top > 0) {
            const headerHeight = status === 'AT_TOP' ? 116 : 80;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const targetPosition = rect.top + scrollTop - headerHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    setActiveLighterType(lighterType);
    setPage(1); // Reset to first page
    setProducts([]); // Clear products
    setHasMore(true); // Reset pagination
  };

  // Handle collection/category changes
  const handleCollectionChange = (collectionSlug: string, categoryId?: number) => {
    // Wait for DOM to settle (products may be loading)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const collectionSection = document.getElementById('collection');
        if (collectionSection) {
          const rect = collectionSection.getBoundingClientRect();
          if (rect.top > 0) {
            const headerHeight = status === 'AT_TOP' ? 116 : 80;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const targetPosition = rect.top + scrollTop - headerHeight;

            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      });
    });

    setActiveCollection(collectionSlug);
    if (categoryId) {
      setActiveCategory(categoryId);
    } else {
      setActiveCategory(undefined);
    }
    // Reset to page 1 and clear existing products when category changes
    setPage(1);
    setProducts([]);
    setHasMore(true);
  };


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
    // Category filtering is now handled server-side via API category parameter
    // No client-side filtering needed
    return products;
  }, [products]);

  if (error) {
    return (
      <section id="collection" className="py-20 md:py-28 bg-product-bg">
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
    <section id="collection" className="py-20 md:py-28 bg-product-bg relative">
      <div className="container mx-auto px-4">
        {/* Tier 1: Collection Carousel */}
        <div
          ref={carouselRef}
          className={`collection-carousel-container ${isAtEnd ? 'at-end' : ''}`}
        >
          <CollectionCarousel
            collections={categories}
            activeCollection={activeCollection}
            onCollectionChange={handleCollectionChange}
          />
        </div>

        {/* Tier 2: Size Filter - Full Width */}
        <div
          className={`size-filter-container-compact ${status === 'AT_TOP' ? 'header-with-banner' : (status === 'MID_PAGE' ? 'header-visible' : '')}`}
        >
          <SizeFilter
            activeSize={activeSize}
            onSizeChange={handleSizeChange}
          />
        </div>

        {/* Section Header */}
        <div className="text-center mb-8">
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
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 md:gap-x-8 gap-y-10 md:gap-y-12 ${(filteredProducts.length > 0 || showSkeletons) ? 'min-h-[400px]' : ''}`}
          >
            {/* Show products - each ProductCard has built-in skeleton that cross-fades */}
            {filteredProducts.map((product) => (
              <div key={product.id} className="content-auto">
                <ProductCard
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.primary_image || '/placeholder-product.jpg'}
                  secondaryImage={product.secondary_image}
                  categoryName={product.category_name}
                  lighterType={product.lighter_type_display}
                  isSoldOut={product.is_sold_out}
                />
              </div>
            ))}

            {/* Show standalone skeletons while waiting for initial data */}
            {showSkeletons && (
              [...Array(skeletonCount)].map((_, i) => (
                <SkeletonCard key={`skeleton-${i}`} />
              ))
            )}

            {/* Only show "No Lighters Found" if NOT loading and list is empty */}
            {!loading && !loadingMore && !showSkeletons && filteredProducts.length === 0 && (
              <motion.div
                className="col-span-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="text-center mt-16 mb-4">
                  <div className="max-w-2xl mx-auto">
                    <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
                      <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
                      No Lighters Found
                    </h2>
                    <p className="font-body text-lg text-muted-foreground">
                      No lighter cases match your current filter selection. Try adjusting your filters to see more of our handcrafted collection.
                    </p>
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
      <div ref={setupObserver} id="bottom-sentinel" className="w-full h-4" />

      {/* Back to Top Button - positioned relative to this section */}
      <BackToTop />
    </section>
  );
};

export default ProductGrid;
