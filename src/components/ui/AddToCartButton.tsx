import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Check, Loader2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useCartToast } from "./CartToast";

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  productImage: string;
  className?: string;
  disabled?: boolean;
}

type ButtonState = 'available' | 'adding' | 'in-cart';

export const AddToCartButton = ({ 
  productId, 
  productName, 
  productImage, 
  className = "",
  disabled = false
}: AddToCartButtonProps) => {
  const { addItem, isInCart } = useCart();
  const { showToast } = useCartToast();
  const [buttonState, setButtonState] = useState<ButtonState>('available');
  const [isInCartState, setIsInCartState] = useState(false);

  const isCurrentlyInCart = isInCart(productId);
  
  // Update local state when cart state changes
  if (isCurrentlyInCart !== isInCartState) {
    setIsInCartState(isCurrentlyInCart);
    if (isCurrentlyInCart) {
      setButtonState('in-cart');
    }
  }

  const handleAddToCart = async () => {
    if (disabled || buttonState === 'adding' || buttonState === 'in-cart') return;
    
    setButtonState('adding');
    
    // Simulate brief loading state for better UX
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      addItem({
        id: productId,
        title: productName,
        image: productImage,
        quantity: 1
      });
      
      showToast(`${productName} added`);
      setButtonState('in-cart');
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      setButtonState('available');
    }
  };

  const getButtonContent = () => {
    switch (buttonState) {
      case 'adding':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Adding...
          </>
        );
      case 'in-cart':
        return (
          <>
            <Check className="h-4 w-4" />
            In Cart
          </>
        );
      default:
        return (
          <>
            <Plus className="h-4 w-4" />
            Add
          </>
        );
    }
  };

  const getButtonVariant = () => {
    switch (buttonState) {
      case 'adding':
        return 'secondary';
      case 'in-cart':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={disabled || buttonState === 'adding' || buttonState === 'in-cart'}
      variant={getButtonVariant()}
      className={`transition-all duration-200 ${className}`}
      size="sm"
    >
      {getButtonContent()}
    </Button>
  );
};
