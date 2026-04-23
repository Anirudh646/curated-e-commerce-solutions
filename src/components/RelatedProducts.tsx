import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LocalProductCard } from '@/components/LocalProductCard';
import { Sparkles } from 'lucide-react';

interface Product {
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
}

interface RelatedProductsProps {
  productId: string;
  category: string;
  price: number;
}

export function RelatedProducts({ productId, category, price }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        // Same category, similar price band (±50%), exclude current
        const minPrice = price * 0.5;
        const maxPrice = price * 1.5;

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('category', category)
          .neq('id', productId)
          .gte('price', minPrice)
          .lte('price', maxPrice)
          .gt('stock', 0)
          .order('rating', { ascending: false, nullsFirst: false })
          .limit(8);

        if (error) throw error;

        let results = data || [];

        // Fallback: if too few, fetch any from category
        if (results.length < 4) {
          const { data: fallback } = await supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .eq('category', category)
            .neq('id', productId)
            .gt('stock', 0)
            .limit(8);
          const seen = new Set(results.map((r) => r.id));
          results = [
            ...results,
            ...(fallback || []).filter((p) => !seen.has(p.id)),
          ].slice(0, 8);
        }

        setProducts(results);
      } catch (e) {
        console.error('Error loading related products:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [productId, category, price]);

  if (loading || products.length === 0) return null;

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="h-5 w-5 text-accent" />
        <h2 className="text-2xl font-bold">You may also like</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <LocalProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}