import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react";

export interface CartItem {
  id: string;
  title: string;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  isInCart: (id: string) => boolean;
  clearCart: () => void;
  itemCount: number;
  triggerBadgeAnimation: () => void;
  badgeAnimationTrigger: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "sacred-beads-cart";

const sanitizeCartData = (data: any): CartItem[] => {
  if (!Array.isArray(data)) return [];
  
  return data.filter(item => {
    // Validate item structure
    if (!item || typeof item !== 'object') return false;
    if (!item.id || typeof item.id !== 'string') return false;
    if (!item.title || typeof item.title !== 'string') return false;
    if (!item.image || typeof item.image !== 'string') return false;
    
    // Validate and sanitize quantity
    const quantity = parseInt(item.quantity, 10);
    if (isNaN(quantity) || quantity < 1 || quantity > 999) return false;
    
    item.quantity = quantity;
    return true;
  });
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];
    
    try {
      const parsed = JSON.parse(stored);
      return sanitizeCartData(parsed);
    } catch (error) {
      console.error('Failed to parse cart data:', error);
      return [];
    }
  });

  const [badgeAnimationTrigger, setBadgeAnimationTrigger] = useState(0);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existingItem = prev.find((i) => i.id === item.id);
      if (existingItem) {
        return prev.map((i) => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    // Trigger badge animation
    setBadgeAnimationTrigger(prev => prev + 1);
  }, []);

  const triggerBadgeAnimation = useCallback(() => {
    setBadgeAnimationTrigger(prev => prev + 1);
    return badgeAnimationTrigger; 
  }, [badgeAnimationTrigger]);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    // Validate quantity
    if (!Number.isInteger(quantity) || quantity < 0 || quantity > 999) {
      console.error('Invalid quantity:', quantity);
      return;
    }
    
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    
    setItems((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const isInCart = useCallback((id: string) => items.some((item) => item.id === id), [items]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const clearCart = useCallback(() => setItems([]), []);

  const contextValue = useMemo(() => ({
    items,
    addItem,
    removeItem,
    updateQuantity,
    isInCart,
    clearCart,
    itemCount,
    triggerBadgeAnimation,
    badgeAnimationTrigger,
  }), [items, addItem, removeItem, updateQuantity, isInCart, clearCart, itemCount, triggerBadgeAnimation, badgeAnimationTrigger]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
