import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast-custom";
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
  const { showToast } = useToast();
  const itemId = String(id);
  const inCart = isInCart(itemId);

  const handleAddToCart = () => {
    addItem({
      id: itemId,
      title: name,
      image,
      quantity: 1,
    });
    showToast(`${name} added to cart`);
  };

  const getImageUrl = (imageSrc: string) => {
    // If it's already a full URL, return as is
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }
    // If it's a relative path from Django media, prepend the base API URL (without /api)
    if (imageSrc.startsWith('/media/')) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://spirit-beads.keycasey.com/api';
      const mediaBaseUrl = baseUrl.replace('/api', '');
      return `${mediaBaseUrl}${imageSrc}`;
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

              </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="font-body text-xs uppercase tracking-wider text-accent mb-1">
          {pattern}
        </p>
        <h3 className="font-display text-lg font-medium text-foreground mb-2">
          {name}
        </h3>
        <div className="flex items-center justify-between">
          <p className="font-body text-lg font-semibold text-primary">
            ${(Number(price) / 100).toFixed(2)}
          </p>
          <div className="flex items-center">
            {!isSoldOut && (
              <button
                onClick={handleAddToCart}
                disabled={inCart}
                className="add-button-bloom border border-primary text-primary bg-transparent disabled:border-foreground disabled:text-foreground disabled:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 h-[44px] w-[70px] md:h-[32px] md:w-[60px] text-xs font-medium rounded-md flex items-center justify-center min-w-0 px-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[0.98] active:duration-[100ms] active:scale-95 md:active:scale-[0.98]"
              >
                <span className={`relative z-10 transition-opacity duration-[150ms] ${inCart ? 'opacity-0' : 'opacity-100'} whitespace-nowrap`}>
                  Add
                </span>
                <Check className={`z-10 h-4 w-4 transition-opacity duration-[150ms] ${inCart ? 'opacity-100' : 'opacity-0'} absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
