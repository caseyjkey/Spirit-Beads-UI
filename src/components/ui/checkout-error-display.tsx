import { AlertCircle, X, ShoppingCart } from "lucide-react";
import { Button } from "./button";
import { CheckoutError, CheckoutErrorDetail } from "@/hooks/use-checkout";
import { useCart } from "@/hooks/use-cart";

interface CheckoutErrorDisplayProps {
  error: CheckoutError;
  onDismiss?: () => void;
}

export const CheckoutErrorDisplay = ({ error, onDismiss }: CheckoutErrorDisplayProps) => {
  const { removeItem, updateQuantity, items } = useCart();

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    onDismiss?.();
  };

  const handleAdjustQuantity = (productId: string, maxQuantity: number) => {
    updateQuantity(productId, maxQuantity);
    onDismiss?.();
  };

  const getItemName = (productId: string) => {
    const item = items.find(item => item.id === productId);
    return item?.title || `Item ${productId}`;
  };

  const getErrorAction = (detail: CheckoutErrorDetail) => {
    switch (detail.error) {
      case 'insufficient_inventory':
        const item = items.find(item => item.id === detail.product_id);
        const maxQuantity = parseInt(detail.message.match(/\d+/)?.[0] || '1', 10);
        return (
          <div className="flex gap-2 mt-2">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleAdjustQuantity(detail.product_id, maxQuantity)}
            >
              Adjust to {maxQuantity}
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => handleRemoveItem(detail.product_id)}
            >
              Remove
            </Button>
          </div>
        );
      
      case 'product_not_found':
      case 'product_sold_out':
        return (
          <Button 
            size="sm" 
            variant="destructive"
            onClick={() => handleRemoveItem(detail.product_id)}
            className="mt-2"
          >
            Remove Item
          </Button>
        );
      
      default:
        return (
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleRemoveItem(detail.product_id)}
            className="mt-2"
          >
            Remove Item
          </Button>
        );
    }
  };

  return (
    <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h4 className="font-semibold text-destructive">Checkout Issue</h4>
        </div>
        {onDismiss && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-muted-foreground hover:text-destructive"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      <p className="text-sm text-destructive mb-3">{error.message}</p>
      
      {error.details && error.details.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Please review these items:</p>
          
          {error.details.map((detail, index) => (
            <div key={index} className="bg-background/50 rounded-md p-3 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{getItemName(detail.product_id)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{detail.message}</p>
              {getErrorAction(detail)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
