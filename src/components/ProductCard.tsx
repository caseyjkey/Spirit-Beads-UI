import { memo, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast-custom";
import { getMediaBaseUrl } from "@/lib/api";
import { Check, RotateCcw } from "lucide-react";
import { useTouchSwipe } from "@/hooks/use-touch-swipe";

interface ProductCardProps {
  id: number;
  name: string;
  price: number | string;
  image: string;
  secondaryImage?: string;
  categoryName?: string;
  lighterType?: string;
  isSoldOut?: boolean;
}

const ProductCard = memo(({ id, name, price, image, secondaryImage, categoryName, lighterType, isSoldOut = false }: ProductCardProps) => {
  const { addItem, isInCart } = useCart();
  const { showToast } = useToast();
  const itemId = String(id);
  const inCart = isInCart(itemId);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isButtonHovering, setIsButtonHovering] = useState(false);

  const { handlers: swipeHandlers } = useTouchSwipe({
    onSwipeLeft: () => secondaryImage && setIsFlipped(true),
    onSwipeRight: () => setIsFlipped(false),
  });

  // Trigger content fade-in after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cardRef.current) {
        cardRef.current.classList.add('data-loaded');
      }
    }, 50); // Small delay for smoother transition
    return () => clearTimeout(timer);
  }, []);

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
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }
    if (imageSrc.startsWith('/media/')) {
      return `${getMediaBaseUrl()}${imageSrc}`;
    }
    return imageSrc;
  };

  return (
    <div
      ref={cardRef}
      className="product-card group relative bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-shadow duration-300"
    >
      {/* SKELETON LAYER (Base) - Always rendered, gets covered by content */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="skeleton-shimmer" style={{ aspectRatio: '4 / 5' }} />
        <div className="p-4 space-y-2">
          <div className="h-3 w-16 skeleton-shimmer rounded" />
          <div className="h-5 w-3/4 skeleton-shimmer rounded" />
          <div className="h-5 w-20 skeleton-shimmer rounded" />
        </div>
      </div>

      {/* CONTENT LAYER (Overlay) - Fades in over skeleton */}
      <div className="product-card-content relative">
        {/* Image Container */}
        <div
          className="relative overflow-hidden"
          style={{ backgroundColor: '#F4F1ED', aspectRatio: '4 / 5' }}
          onMouseEnter={() => secondaryImage && !isButtonHovering && setIsHovering(true)}
          onMouseLeave={() => {
            if (secondaryImage && !isButtonHovering) {
              setIsHovering(false);
              setIsFlipped(false); // Reset flip state when hover ends
            }
          }}
          {...swipeHandlers}
        >
          {/* Flip Icon */}
          {secondaryImage && (
            <motion.button
              className="absolute top-3 left-3 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-soft flex items-center justify-center border border-gray-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setIsFlipped(!isFlipped);
              }}
              onMouseEnter={() => setIsButtonHovering(true)}
              onMouseLeave={() => setIsButtonHovering(false)}
              animate={{
                backgroundColor: isButtonHovering ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.9)',
              }}
            >
              <RotateCcw className={`w-4 h-4 text-gray-700 transition-transform duration-300 ${isFlipped ? 'rotate-180' : ''}`} />
            </motion.button>
          )}

          {/* Mobile Corner Fold Indicator */}
          {secondaryImage && (
            <div className="absolute bottom-3 right-3 z-20 md:hidden">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-transparent to-gray-800/20" />
                <div className="absolute bottom-1 right-1 text-xs font-medium text-gray-700 uppercase tracking-wider">
                  {isFlipped ? 'Front' : 'Back'}
                </div>
              </div>
            </div>
          )}

          {/* Image Slider */}
          <div className="relative w-full h-full overflow-hidden">
            {/* Primary Image */}
            <motion.img
              src={getImageUrl(image)}
              alt={`${name} - ${categoryName || 'beaded lighter case'} - Front`}
              loading="lazy"
              decoding="async"
              className="product-card-image absolute inset-0 w-full h-full object-cover"
              style={{ cursor: secondaryImage ? (isHovering ? 'grab' : 'pointer') : 'default' }}
              animate={{
                x: (isHovering && !isFlipped) ? '-100%' : '0',
                zIndex: (isHovering && !isFlipped) ? 1 : 2
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              onLoad={(e) => {
                e.currentTarget.classList.add('image-loaded');
              }}
              onError={(e) => {
                e.currentTarget.src = '/placeholder-product.svg';
                e.currentTarget.classList.add('image-loaded');
              }}
            />

            {/* Secondary Image */}
            {secondaryImage && (
              <motion.img
                src={getImageUrl(secondaryImage)}
                alt={`${name} - ${categoryName || 'beaded lighter case'} - Back`}
                loading="lazy"
                decoding="async"
                className="product-card-image absolute inset-0 w-full h-full object-cover"
                style={{ cursor: secondaryImage ? 'grab' : 'default' }}
                animate={{
                  x: (isHovering && !isFlipped) ? '0' : '100%',
                  zIndex: (isHovering && !isFlipped) ? 2 : 1
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onLoad={(e) => {
                  e.currentTarget.classList.add('image-loaded');
                }}
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-product.svg';
                  e.currentTarget.classList.add('image-loaded');
                }}
              />
            )}
          </div>

          {isSoldOut && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="font-body font-semibold text-foreground uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}

          {lighterType && (
            <div className="absolute top-3 right-3 md:top-4 md:right-4">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-[#4A4A4A]/90 text-[#F4F1ED] backdrop-blur-sm">
                {lighterType}
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 bg-card">
          <p className="font-body text-xs uppercase tracking-wider text-accent mb-1">
            {categoryName}
          </p>
          <h3 className="font-display text-lg font-medium text-foreground mb-2">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="font-body text-lg font-semibold text-primary">
              ${Math.floor(Number(price) / 100)}
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
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
