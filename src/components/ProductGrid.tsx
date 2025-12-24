import ProductCard from "./ProductCard";
import CustomOrderDialog from "./CustomOrderDialog";

import lighterCase1 from "@/assets/products/lighter-case-1.jpg";
import lighterCase2 from "@/assets/products/lighter-case-2.jpg";
import lighterCase3 from "@/assets/products/lighter-case-3.jpg";
import lighterCase4 from "@/assets/products/lighter-case-4.jpg";
import lighterCase5 from "@/assets/products/lighter-case-5.jpg";
import lighterCase6 from "@/assets/products/lighter-case-6.jpg";

const products = [
  {
    id: 1,
    name: "Desert Diamond",
    price: 45.00,
    image: lighterCase1,
    pattern: "Chevron Pattern",
  },
  {
    id: 2,
    name: "Turquoise Trail",
    price: 48.00,
    image: lighterCase2,
    pattern: "Geometric Pattern",
  },
  {
    id: 3,
    name: "Sunburst Spirit",
    price: 52.00,
    image: lighterCase3,
    pattern: "Sunburst Pattern",
  },
  {
    id: 4,
    name: "Sacred Stone",
    price: 46.00,
    image: lighterCase4,
    pattern: "Diamond Pattern",
  },
  {
    id: 5,
    name: "Forest Fire",
    price: 50.00,
    image: lighterCase5,
    pattern: "Mountain Pattern",
  },
  {
    id: 6,
    name: "Rainbow Ridge",
    price: 55.00,
    image: lighterCase6,
    pattern: "Arrow Pattern",
    isSoldOut: true,
  },
];

const ProductGrid = () => {
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
              <ProductCard {...product} />
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
