import ProductCard from "./ProductCard";
import CustomOrderDialog from "./CustomOrderDialog";
import CategoryPills from "./CategoryPills";
import { useProducts } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define boutique categories
const BOUTIQUE_CATEGORIES = [
  { slug: 'ancestral-motifs', name: 'Ancestral Motifs' },
  { slug: 'infinite-path', name: 'Infinite Path' },
  { slug: 'traditional-rhythms', name: 'Traditional Rhythms' },
  { slug: 'earths-hue', name: 'Earth\'s Hue' },
];

const ProductGrid = () => {
  const { products, loading, error } = useProducts();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter(p => p.category === activeCategory);
  }, [activeCategory, products]);

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

  if (filteredProducts.length === 0) {
    return (
      <section id="collection" className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-accent/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-foreground mb-4">
              No Lighters Currently in Stock
            </h2>
            <p className="font-body text-lg text-muted-foreground mb-8">
              All of our handcrafted lighter cases have found their homes. Each piece is uniquely made with traditional beadwork techniques, and we're currently crafting new ones.
            </p>
            <div className="space-y-4">
              <p className="font-body text-muted-foreground">
                Interested in a custom design? We can create a unique piece just for you.
              </p>
              <CustomOrderDialog />
            </div>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section id="collection" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Category Pills */}
        <CategoryPills
          categories={BOUTIQUE_CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
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

        {/* Product Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
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
          </motion.div>
        </AnimatePresence>

        {/* Custom Order CTA */}
        <div className="text-center mt-12 md:mt-16">
          <p className="font-body text-muted-foreground mb-4">
            Looking for a custom design or color combination?
          </p>
          <CustomOrderDialog />
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
