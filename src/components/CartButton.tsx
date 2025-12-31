import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useCheckoutSidebar } from "@/hooks/use-checkout-sidebar";
import { CheckoutSidebar } from "./CheckoutSidebar";

export const CartButton = () => {
  const { itemCount, badgeAnimationTrigger } = useCart();
  const { isOpen, openSidebar, closeSidebar } = useCheckoutSidebar();

  return (
    <>
      <Button variant="ghost" size="icon" onClick={openSidebar} className="relative">
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <span 
            key={badgeAnimationTrigger}
            className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center cart-badge-animate"
          >
            {itemCount}
          </span>
        )}
      </Button>
      
      <CheckoutSidebar isOpen={isOpen} onClose={closeSidebar} />
    </>
  );
};
