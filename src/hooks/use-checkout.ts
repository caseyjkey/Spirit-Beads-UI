import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';

export interface CheckoutErrorDetail {
  product_id: string;
  error: string;
  message: string;
}

export interface CheckoutError {
  error?: string;
  message: string;
  details?: CheckoutErrorDetail[];
}

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<CheckoutError | null>(null);
  const { items } = useCart();

  const checkout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Transform cart items to match required API structure
      const apiItems = items.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      }));

      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://spirit-beads.keycasey.com/api';
      const checkoutUrl = baseUrl.replace('/api', '') + '/api/payments/create-checkout-session/';

      const response = await fetch(checkoutUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: apiItems }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Parse structured error response
        const checkoutError: CheckoutError = {
          message: errorData.message || errorData.error || `Checkout failed: ${response.status} ${response.statusText}`,
          details: errorData.details || []
        };
        
        setError(checkoutError);
        throw checkoutError; // Throw the actual error object instead of just message
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout (don't clear cart yet)
      window.location.href = data.checkout_url;
    } catch (err) {
      if (err instanceof Error) {
        setError({ message: err.message, details: [] });
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { checkout, isLoading, error, setError };
};
