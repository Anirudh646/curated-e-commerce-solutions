import { useEffect, useState, useMemo } from 'react';
import { LocalProductCard } from '@/components/LocalProductCard';
import { ProductFilters, FilterState } from '@/components/ProductFilters';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Package } from 'lucide-react';

interface LocalProduct {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  category: string;
  rating: number | null;
  reviews_count: number | null;
  badge: string | null;
  stock: number;
  description: string | null;
  is_active: boolean;
}

export function LocalProducts() {
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    priceRange: [0, 50000],
    sortBy: 'newest',
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))];
    return cats.sort();
  }, [products]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 50000;
    return Math.ceil(Math.max(...products.map(p => p.price)) / 1000) * 1000;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      result = result.filter(p => p.category === filters.category);
    }

    // Price range filter
    result = result.filter(p => 
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Sorting
    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
      default:
        // Already sorted by created_at desc
        break;
    }

    return result;
  }, [products, filters]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="text-sm font-medium text-accent uppercase tracking-wider">
                Featured Collection
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
                Our Products
              </h2>
            </div>
          </div>
          <div className="text-center py-16 bg-secondary/50 rounded-lg">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Check back soon for amazing products!
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Featured Collection
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              Our Products
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Discover our carefully curated selection of premium products from India.
          </p>
        </div>

        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          maxPrice={maxPrice}
        />

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <LocalProductCard product={product} onImageClick={scrollToTop} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
