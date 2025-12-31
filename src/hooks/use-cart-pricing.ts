import { useState, useEffect } from 'react';
import { useCart } from './use-cart';
import { apiClient, Product } from '@/lib/api';

export const useCartPricing = () => {
  const { items } = useCart();
  const [cartItemsWithPricing, setCartItemsWithPricing] = useState<(Product & { cartId: string; quantity: number; image: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCartPricing = async () => {
      if (items.length === 0) {
        setCartItemsWithPricing([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch all products to get current pricing
        const allProducts = await apiClient.getProducts();
        
        // Match cart items with current product data
        const cartWithPricing = items
          .map(cartItem => {
            const product = allProducts.find(p => String(p.id) === cartItem.id);
            if (!product) return null;
            
            return {
              ...product,
              cartId: cartItem.id,
              quantity: cartItem.quantity,
              image: cartItem.image, // Preserve the original cart item image
            };
          })
          .filter(Boolean) as (Product & { cartId: string; quantity: number; image: string })[];

        setCartItemsWithPricing(cartWithPricing);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pricing');
      } finally {
        setLoading(false);
      }
    };

    fetchCartPricing();
  }, [items]);

  const subtotal = cartItemsWithPricing.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return {
    cartItemsWithPricing,
    loading,
    error,
    subtotal,
  };
};
