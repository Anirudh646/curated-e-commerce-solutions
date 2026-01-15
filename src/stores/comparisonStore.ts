import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ComparisonProduct {
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
}

interface ComparisonState {
  products: ComparisonProduct[];
  isOpen: boolean;
  addProduct: (product: ComparisonProduct) => boolean;
  removeProduct: (productId: string) => void;
  clearAll: () => void;
  isInComparison: (productId: string) => boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const MAX_COMPARE_ITEMS = 4;

export const useComparisonStore = create<ComparisonState>()(
  persist(
    (set, get) => ({
      products: [],
      isOpen: false,

      addProduct: (product) => {
        const state = get();
        if (state.products.length >= MAX_COMPARE_ITEMS) {
          return false;
        }
        if (state.isInComparison(product.id)) {
          return true;
        }
        set((state) => ({
          products: [...state.products, product],
        }));
        return true;
      },

      removeProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        }));
      },

      clearAll: () => {
        set({ products: [], isOpen: false });
      },

      isInComparison: (productId) => {
        return get().products.some((p) => p.id === productId);
      },

      setIsOpen: (isOpen) => {
        set({ isOpen });
      },
    }),
    {
      name: 'product-comparison-storage',
    }
  )
);
