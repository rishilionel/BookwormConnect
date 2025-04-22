import { useEffect } from 'react';
import { useCartStore } from '@/lib/cart-store';

export function useCart() {
  const {
    items,
    isOpen,
    isLoading,
    openCart,
    closeCart,
    toggleCart,
    fetchCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getCartCount,
    getSubtotal,
    getShipping,
    getTotal
  } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    items,
    isOpen,
    isLoading,
    openCart,
    closeCart,
    toggleCart,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    cartCount: getCartCount(),
    subtotal: getSubtotal(),
    shipping: getShipping(),
    total: getTotal()
  };
}
