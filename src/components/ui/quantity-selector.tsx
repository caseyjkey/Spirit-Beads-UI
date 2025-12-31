import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity?: number;
  onQuantityChange: (quantity: number) => void;
  size?: "sm" | "md" | "lg";
}

export const QuantitySelector = ({ 
  quantity, 
  maxQuantity, 
  onQuantityChange, 
  size = "md" 
}: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (maxQuantity === undefined || quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-9 w-9 text-sm",
    lg: "h-10 w-10 text-base"
  };

  const buttonSizeClasses = {
    sm: "h-8 w-8",
    md: "h-9 w-9", 
    lg: "h-10 w-10"
  };

  const isAtMax = maxQuantity !== undefined && quantity >= maxQuantity;

  return (
    <div className="inline-flex items-center border border-border rounded-md">
      <Button
        variant="ghost"
        size="icon"
        className={buttonSizeClasses[size]}
        onClick={handleDecrease}
        disabled={quantity <= 1}
      >
        <Minus className="h-3 w-3" />
      </Button>
      <span className={`font-body font-medium ${sizeClasses[size]} flex items-center justify-center`}>
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className={buttonSizeClasses[size]}
        onClick={handleIncrease}
        disabled={isAtMax}
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
};
