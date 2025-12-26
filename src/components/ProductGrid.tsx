import ProductCard from "./ProductCard";
import CustomOrderDialog from "./CustomOrderDialog";
import { useProducts } from "@/hooks/use-api";
import { Skeleton } from "@/components/ui/skeleton";

const ProductGrid = () => {
  const { products, loading, error } = useProducts();

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
    <section id="collection" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProductCard 
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.primary_image || '/placeholder-product.jpg'}
                pattern={product.pattern_display}
                isSoldOut={product.is_sold_out}
              />
            </div>
          ))}
        </div>

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
