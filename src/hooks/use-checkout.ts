import { useState } from 'react';
import { useCart } from '@/hooks/use-cart';

export const useCheckout = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { items } = useCart();

  const checkout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Transform cart items to match required API structure
      const apiItems = items.map(item => ({
        product_id: item.id,
        quantity: 1 // Assuming quantity is always 1 for now
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
        throw new Error(`Checkout failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Redirect to Stripe checkout (don't clear cart yet)
      window.location.href = data.checkout_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { checkout, isLoading, error };
};
