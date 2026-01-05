import { useEffect, useState } from 'react';
import { ShopifyProductCard } from '@/components/ShopifyProductCard';
import { fetchShopifyProducts, ShopifyProduct } from '@/lib/shopify';
import { Loader2, Package } from 'lucide-react';

export function ShopifyProducts() {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const fetchedProducts = await fetchShopifyProducts(20);
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

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

  if (error) {
    return (
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center py-12">
            <p className="text-lg text-destructive">{error}</p>
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
              Your store doesn't have any products yet. Tell me what products you'd like to create, including the name, description, and price!
            </p>
          </div>
        </div>
      </section>
    );
  }

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
          <p className="text-muted-foreground max-w-md">
            Discover our carefully curated selection of premium products, each chosen for quality and design excellence.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((product, index) => (
            <div
              key={product.node.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ShopifyProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
