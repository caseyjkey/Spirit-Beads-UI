import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

interface CartButtonProps {
  onClick: () => void;
}

export const CartButton = ({ onClick }: CartButtonProps) => {
  const { itemCount, badgeAnimationTrigger } = useCart();

  return (
    <Button variant="ghost" size="icon" onClick={onClick} className="relative">
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
  );
};
