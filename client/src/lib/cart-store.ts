import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from './queryClient';
import { nanoid } from 'nanoid';

export interface CartProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  compareAtPrice: string | null;
  imageUrl: string;
  categoryId: number;
}

export interface CartItem {
  id: number;
  sessionId: string;
  productId: number;
  quantity: number;
  createdAt: Date;
  product?: CartProduct;
}

interface CartState {
  items: CartItem[];
  sessionId: string;
  isOpen: boolean;
  isLoading: boolean;
  
  // Actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Cart operations
  fetchCart: () => Promise<void>;
  addItem: (productId: number, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  
  // Derived data
  getCartCount: () => number;
  getSubtotal: () => number;
  getShipping: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      sessionId: nanoid(),
      isOpen: false,
      isLoading: false,
      
      // UI Actions
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      // Cart operations
      fetchCart: async () => {
        try {
          set({ isLoading: true });
          const { sessionId } = get();
          const response = await fetch(`/api/cart/${sessionId}`);
          if (!response.ok) throw new Error('Failed to fetch cart');
          const items = await response.json();
          set({ items, isLoading: false });
        } catch (error) {
          console.error('Error fetching cart:', error);
          set({ isLoading: false });
        }
      },
      
      addItem: async (productId, quantity = 1) => {
        try {
          set({ isLoading: true });
          const { sessionId, fetchCart } = get();
          
          await apiRequest('POST', '/api/cart', {
            sessionId,
            productId,
            quantity
          });
          
          await fetchCart();
          set({ isOpen: true, isLoading: false });
        } catch (error) {
          console.error('Error adding item to cart:', error);
          set({ isLoading: false });
        }
      },
      
      updateQuantity: async (itemId, quantity) => {
        try {
          set({ isLoading: true });
          const { fetchCart } = get();
          
          await apiRequest('PATCH', `/api/cart/${itemId}`, { quantity });
          await fetchCart();
          set({ isLoading: false });
        } catch (error) {
          console.error('Error updating cart item:', error);
          set({ isLoading: false });
        }
      },
      
      removeItem: async (itemId) => {
        try {
          set({ isLoading: true });
          const { fetchCart } = get();
          
          await apiRequest('DELETE', `/api/cart/${itemId}`);
          await fetchCart();
          set({ isLoading: false });
        } catch (error) {
          console.error('Error removing item from cart:', error);
          set({ isLoading: false });
        }
      },
      
      clearCart: async () => {
        try {
          set({ isLoading: true });
          const { sessionId } = get();
          
          await apiRequest('DELETE', `/api/cart/session/${sessionId}`);
          set({ items: [], isLoading: false });
        } catch (error) {
          console.error('Error clearing cart:', error);
          set({ isLoading: false });
        }
      },
      
      // Derived data
      getCartCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      getSubtotal: () => {
        return get().items.reduce((total, item) => {
          if (!item.product) return total;
          return total + (parseFloat(item.product.price) * item.quantity);
        }, 0);
      },
      
      getShipping: () => {
        const subtotal = get().getSubtotal();
        // Free shipping on orders over ₹1000
        return subtotal > 1000 ? 0 : 50;
      },
      
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const shipping = get().getShipping();
        return subtotal + shipping;
      }
    }),
    {
      name: 'diwali-cart-storage',
      partialize: (state) => ({ 
        sessionId: state.sessionId,
        items: state.items 
      }),
    }
  )
);
