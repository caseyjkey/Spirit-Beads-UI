import { Button } from "@/components/ui/button";

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  pattern: string;
  isSoldOut?: boolean;
}

const ProductCard = ({ name, price, image, pattern, isSoldOut = false }: ProductCardProps) => {
  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={image}
          alt={`${name} - ${pattern} beaded lighter case`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {isSoldOut && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <span className="font-body font-semibold text-foreground uppercase tracking-wider">
              Sold Out
            </span>
          </div>
        )}

        {/* Quick Add Overlay */}
        {!isSoldOut && (
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            <Button variant="hero" size="default">
              Add to Cart
            </Button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="font-body text-xs uppercase tracking-wider text-accent mb-1">
          {pattern}
        </p>
        <h3 className="font-display text-lg font-medium text-foreground mb-2">
          {name}
        </h3>
        <p className="font-body text-lg font-semibold text-primary">
          ${price.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
