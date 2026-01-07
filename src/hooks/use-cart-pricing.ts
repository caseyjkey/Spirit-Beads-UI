import { useState, useEffect } from 'react';
import { useCart } from './use-cart';
import { apiClient, Product } from '@/lib/api';

export const useCartPricing = () => {
  const { items } = useCart();
  const [cartItemsWithPricing, setCartItemsWithPricing] = useState<any[]>([]);
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
        
        // Extract unique product IDs from cart items (keep as strings for UUIDs)
        const productIds = [...new Set(items.map(item => String(item.id)))];
        
        // Fetch only the products that are actually in the cart
        const response = await apiClient.getBatchProducts(productIds);
        
        // Check if response has the expected structure
        if (!response || !response.products || !Array.isArray(response.products)) {
          console.error('Invalid batch API response:', response);
          setError('Failed to fetch product details');
          setLoading(false);
          return;
        }
        
        // Check for missing products
        const requestedIds = productIds;
        const foundIds = response.products.map(p => String(p.id));
        const missingIds = requestedIds.filter(id => !foundIds.includes(id));
        
        if (missingIds.length > 0) {
          console.warn('Missing products detected:', missingIds);
          setError(`${missingIds.length} item(s) in your cart are no longer available`);
          setCartItemsWithPricing([]);
          setLoading(false);
          return;
        }
        
        // Create cart items with pricing by merging local cart data with API product data
        const cartItemsWithPricing = items.map(cartItem => {
          const product = response.products.find(p => String(p.id) === String(cartItem.id));
          if (product) {
            return {
              ...cartItem,
              cartId: cartItem.id,
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.primary_image || cartItem.image,
              pattern_display: product.pattern_display,
              is_sold_out: product.is_sold_out,
              inventory_count: product.inventory_count,
              is_in_stock: product.is_in_stock,
              quantity: cartItem.quantity,
              product: product
            };
          }
          return null;
        }).filter(item => item !== null);
        
        setCartItemsWithPricing(cartItemsWithPricing);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch pricing');
      } finally {
        setLoading(false);
      }
    };

    fetchCartPricing();
  }, [items]);

  const subtotal = cartItemsWithPricing.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Helper function to check if checkout should be disabled
  const hasOutOfStockItems = () => {
    return cartItemsWithPricing.some(item => 
      item.is_sold_out || 
      item.inventory_count === 0 || 
      item.quantity > item.inventory_count
    );
  };

  return {
    cartItemsWithPricing,
    loading,
    error,
    subtotal,
    hasOutOfStockItems,
  };
};
