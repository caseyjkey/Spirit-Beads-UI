import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Check } from "lucide-react";

interface ProductCardProps {
  id: number;
  name: string;
  price: number | string;
  image: string;
  pattern: string;
  isSoldOut?: boolean;
}

const ProductCard = ({ id, name, price, image, pattern, isSoldOut = false }: ProductCardProps) => {
  const { addItem, isInCart } = useCart();
  const itemId = String(id);
  const inCart = isInCart(itemId);

  const handleAddToCart = () => {
    addItem({
      id: itemId,
      title: name,
      price: Math.round(Number(price) * 100), // convert to cents
      image,
    });
  };

  const getImageUrl = (imageSrc: string) => {
    // If it's already a full URL, return as is
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }
    // If it's a relative path from Django media, prepend the base URL
    if (imageSrc.startsWith('/media/')) {
      return `https://spirit-beads.keycasey.com${imageSrc}`;
    }
    // Otherwise treat as local asset
    return imageSrc;
  };

  return (
    <div className="group relative bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <img
          src={getImageUrl(image)}
          alt={`${name} - ${pattern} beaded lighter case`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.src = '/placeholder-product.svg';
          }}
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
            {inCart ? (
              <Button variant="secondary" size="default" disabled>
                <Check className="h-4 w-4 mr-2" />
                In Cart
              </Button>
            ) : (
              <Button variant="hero" size="default" onClick={handleAddToCart}>
                Add to Cart
              </Button>
            )}
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
          ${Number(price).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;
