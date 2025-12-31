import { Button } from "@/components/ui/button";
import { ShoppingBag, X, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useCartPricing } from "@/hooks/use-cart-pricing";
import { useCheckout } from "@/hooks/use-checkout";
import { Separator } from "@/components/ui/separator";
import { QuantitySelector } from "@/components/ui/quantity-selector";
import { Loader2 } from "lucide-react";

const CartSheet = () => {
  const { items, removeItem, itemCount, updateQuantity } = useCart();
  const { cartItemsWithPricing, loading, error: pricingError, subtotal } = useCartPricing();
  const { checkout, isLoading, error } = useCheckout();

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleCheckout = async () => {
    try {
      await checkout();
    } catch (err) {
      // Error is handled in the hook
      console.error('Checkout error:', err);
    }
  };

  const handleQuantityChange = (cartId: string, newQuantity: number) => {
    updateQuantity(cartId, newQuantity);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-display text-xl">Your Cart</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <ShoppingBag className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <p className="font-body text-muted-foreground">Your cart is empty</p>
            <p className="font-body text-sm text-muted-foreground/70 mt-1">
              Add some unique pieces to get started
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {cartItemsWithPricing.map((item) => (
                  <div key={item.cartId} className="flex gap-4">
                    <div className="w-20 h-24 bg-secondary rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={item.primary_image || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-display font-medium text-foreground truncate">
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
                        <p className="font-body text-xs text-muted-foreground mt-2">
                          Quantity: {item.quantity}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.cartId)}
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-4">
              {pricingError && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  <p className="text-sm text-destructive">{pricingError}</p>
                </div>
              )}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="font-body text-muted-foreground">Subtotal</span>
                <div className="h-[1.25rem] flex items-center justify-center">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : (
                    <span className="font-display text-xl font-semibold text-foreground">
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
                Checkout
              </Button>
              <p className="font-body text-xs text-center text-muted-foreground">
                Shipping calculated at checkout
              </p>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
