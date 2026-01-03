import { ProductCard } from '@/components/ProductCard';
import { products } from '@/data/products';
import { useStore } from '@/lib/store';
import { useMemo } from 'react';

export function FeaturedProducts() {
  const { searchQuery, selectedCategory } = useStore();

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <div>
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Featured Collection
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              {selectedCategory === 'All' ? 'Our Products' : selectedCategory}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            Discover our carefully curated selection of premium products, each chosen for quality and design excellence.
          </p>
        </div>

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
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
