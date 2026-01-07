import { useState, useEffect } from "react";
import { X, ShoppingBag, Trash2, Plus, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useCartPricing } from "@/hooks/use-cart-pricing";
import { useCheckout, CheckoutError } from "@/hooks/use-checkout";
import { Separator } from "@/components/ui/separator";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { CheckoutErrorDisplay } from "@/components/ui/checkout-error-display";
import { TrustPillars } from "@/components/TrustPillars";

interface CheckoutSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

type CartItemRowProps = {
  cartId: string;
  onRemove: (cartId: string) => void;
  children: React.ReactNode;
};

const CartItemRow = ({ cartId, onRemove, children }: CartItemRowProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!isDeleting) return;
    const removeTimeoutId = window.setTimeout(() => {
      onRemove(cartId);
    }, 250);

    return () => {
      window.clearTimeout(removeTimeoutId);
    };
  }, [cartId, isDeleting, onRemove]);

  const handleDelete = () => {
    if (isDeleting) return;
    setIsDeleting(true);
  };

  return (
    <div className={`cart-item${isDeleting ? " is-deleting" : ""}`}>
      <div className="cart-item-inner">
        {children}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          className="text-gray-400 hover:text-red-500 flex-shrink-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export const CheckoutSidebar = ({ isOpen, onClose }: CheckoutSidebarProps) => {
  const { items, removeItem, itemCount, updateQuantity } = useCart();
  const { cartItemsWithPricing, loading, error: pricingError, subtotal } = useCartPricing();
  const { checkout, isLoading, error, setError } = useCheckout();
  const [showCheckoutError, setShowCheckoutError] = useState(false);
  const [localCheckoutError, setLocalCheckoutError] = useState<CheckoutError | null>(null);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Control external overlay for nuclear debugging test
  useEffect(() => {
    const overlay = document.getElementById('checkout-overlay');
    if (overlay) {
      if (isOpen) {
        // Use requestAnimationFrame to ensure perfect synchronization with sidebar
        requestAnimationFrame(() => {
          overlay.classList.add('is-active');
        });

        // Add click handler to overlay
        const handleOverlayClick = (e: MouseEvent) => {
          if (e.target === overlay) {
            onClose();
          }
        };
        overlay.addEventListener('click', handleOverlayClick);

        return () => {
          overlay.removeEventListener('click', handleOverlayClick);
          overlay.classList.remove('is-active');
        };
      } else {
        // Use requestAnimationFrame for synchronized closing
        requestAnimationFrame(() => {
          overlay.classList.remove('is-active');
        });
      }
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return;
    }

    setIsVisible(false);
    const timeoutId = window.setTimeout(() => {
      setIsRendered(false);
    }, 400);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen]);

  const formatPrice = (cents: number) => {
    if (isNaN(cents) || !isFinite(cents)) {
      return '$0';
    }
    return `$${Math.floor(cents / 100)}`;
  };

  const getImageUrl = (imageSrc: string) => {
    if (imageSrc.startsWith('http')) {
      return imageSrc;
    }
    if (imageSrc.startsWith('/media/')) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://spirit-beads.keycasey.com/api';
      const mediaBaseUrl = baseUrl.replace('/api', '');
      return `${mediaBaseUrl}${imageSrc}`;
    }
    return imageSrc;
  };

  const handleCheckout = async () => {
    try {
      setShowCheckoutError(false);
      setLocalCheckoutError(null);
      await checkout();
    } catch (err) {
      if (err && typeof err === 'object' && 'message' in err && 'details' in err) {
        setLocalCheckoutError(err as CheckoutError);
      } else {
        setLocalCheckoutError({
          message: err instanceof Error ? err.message : 'Checkout failed',
          details: []
        });
      }
      setShowCheckoutError(true);
    }
  };

  const handleDismissError = () => {
    setShowCheckoutError(false);
    setLocalCheckoutError(null);
    setError(null);
  };

  const handleQuantityChange = (cartId: string, newQuantity: number) => {
    updateQuantity(cartId, newQuantity);
  };

  if (!isRendered) return null;

  return (
    <>
      {/* Checkout Sidebar */}
      <div
        className={`checkout-sidebar fixed right-0 top-16 md:top-20 h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)] w-[400px] bg-white shadow-2xl z-[160] flex flex-col${isVisible ? " is-open" : ""}`}
      >
        {/* Header with Close Button */}
        <div className="relative flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-display font-semibold">Your Cart</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="z-95 hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Cart Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-gray-400 mb-4" />
            <p className="font-body text-gray-500">Your cart is empty</p>
            <p className="font-body text-sm text-gray-400 mt-1">
              Add some unique pieces to get started
            </p>
          </div>
        ) : (
          <>
            {/* Product List */}
            <div className="flex-1 overflow-auto py-4 max-h-[calc(100vh-16rem)] md:max-h-[calc(100vh-20rem)]">
              <div className="px-6">
                {cartItemsWithPricing.map((item) => (
                  <CartItemRow key={item.cartId} cartId={item.cartId} onRemove={removeItem}>
                    <div className="w-20 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.image || '/placeholder-product.jpg')}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-product.svg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="font-body text-primary font-semibold mt-1">
                        {formatPrice(item.price)}
                      </p>
                      {item.inventory_count > 1 && (
                        <div className="mt-2">
                          <QuantitySelector
                            quantity={item.quantity}
                            maxQuantity={item.inventory_count}
                            onQuantityChange={(newQuantity) => handleQuantityChange(item.cartId, newQuantity)}
                            size="sm"
                          />
                        </div>
                      )}
                      {item.inventory_count <= 1 && (
                        <p className="font-body text-xs text-gray-500 mt-2">
                          Quantity: {item.quantity}
                        </p>
                      )}
                    </div>
                  </CartItemRow>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100 mx-6 my-4" />

              {/* Trust Pillars */}
              <div className="px-6">
                <TrustPillars />
              </div>
            </div>

            {/* Checkout Section - Fixed at bottom */}
            <div className="border-t border-gray-200 p-6 space-y-4 flex-shrink-0">
              {pricingError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-600">{pricingError}</p>
                </div>
              )}
              {localCheckoutError && showCheckoutError && (
                <CheckoutErrorDisplay
                  error={localCheckoutError}
                  onDismiss={handleDismissError}
                />
              )}
              <div className="flex items-center justify-between">
                <span className="font-body text-gray-600">Subtotal</span>
                <div className="h-[1.25rem] flex items-center justify-center">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  ) : (
                    <span className="font-display text-xl font-semibold text-gray-900">
                      {formatPrice(subtotal)}
                    </span>
                  )}
                </div>
              </div>
              <Button
                className="w-full transition-all duration-100"
                size="lg"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Checkout'
                )}
              </Button>
              <p className="font-body text-[0.75rem] text-center text-gray-500">
                Shipping: $5 Flat (USA) or Calculated (Int'l)
              </p>
            </div>
          </>
        )}
      </div>
    </>
  );
};
