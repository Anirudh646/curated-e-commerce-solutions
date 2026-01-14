import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  description: string;
  variants?: { color?: string; size?: string }[];
  inStock: boolean;
  badge?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariant?: { color?: string; size?: string };
}

export interface RecentlyViewedProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  category: string;
  rating?: number | null;
  reviews_count?: number | null;
  badge?: string | null;
  stock: number;
  viewedAt: number;
}

interface StoreState {
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: RecentlyViewedProduct[];
  searchQuery: string;
  selectedCategory: string;
  addToCart: (product: Product, variant?: { color?: string; size?: string }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;
  addToRecentlyViewed: (product: RecentlyViewedProduct) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const MAX_RECENTLY_VIEWED = 10;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      recentlyViewed: [],
      searchQuery: '',
      selectedCategory: 'All',

      addToCart: (product, variant) => {
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.id === product.id
          );
          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            cart: [...state.cart, { ...product, quantity: 1, selectedVariant: variant }],
          };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
          ).filter((item) => item.quantity > 0),
        }));
      },

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (product) => {
        set((state) => {
          const isInWishlist = state.wishlist.some((item) => item.id === product.id);
          return {
            wishlist: isInWishlist
              ? state.wishlist.filter((item) => item.id !== product.id)
              : [...state.wishlist, product],
          };
        });
      },

      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },

      addToRecentlyViewed: (product) => {
        set((state) => {
          // Remove if already exists
          const filtered = state.recentlyViewed.filter((p) => p.id !== product.id);
          // Add to beginning with timestamp
          const updated = [{ ...product, viewedAt: Date.now() }, ...filtered];
          // Keep only max items
          return { recentlyViewed: updated.slice(0, MAX_RECENTLY_VIEWED) };
        });
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedCategory: (category) => set({ selectedCategory: category }),

      getCartTotal: () => {
        return get().cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getCartCount: () => {
        return get().cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'luxestore-storage',
    }
  )
);
