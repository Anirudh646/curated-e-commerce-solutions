import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LocalProductCard } from '@/components/LocalProductCard';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Flame, ChevronRight, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

const TIERS = [
  { id: 'all', label: 'All Deals', min: 0 },
  { id: '20', label: '20%+ Off', min: 20 },
  { id: '40', label: '40%+ Off', min: 40 },
  { id: '60', label: '60%+ Off', min: 60 },
];

export default function Deals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [tier, setTier] = useState('all');
  const [visible, setVisible] = useState(24);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .not('original_price', 'is', null)
          .gt('stock', 0)
          .limit(500);

        if (error) throw error;
        setProducts(data || []);
      } catch (e) {
        console.error('Error loading deals:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sorted = useMemo(() => {
    const withDiscount = products
      .filter((p) => p.original_price && p.original_price > p.price)
      .map((p) => ({
        ...p,
        discountPct: Math.round(((p.original_price! - p.price) / p.original_price!) * 100),
      }));

    const minPct = TIERS.find((t) => t.id === tier)?.min || 0;
    return withDiscount
      .filter((p) => p.discountPct >= minPct)
      .sort((a, b) => b.discountPct - a.discountPct);
  }, [products, tier]);

  const topDeal = sorted[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <div className="relative overflow-hidden bg-gradient-to-br from-destructive/20 via-accent/10 to-background border-b border-border">
          <div className="container py-12 md:py-16">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">Deals</span>
            </nav>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-destructive text-destructive-foreground rounded-md">
                <Flame className="h-6 w-6" />
              </div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                Hot Deals & Offers
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl text-base md:text-lg">
              Biggest discounts across every category. Limited stock — grab them before they're gone.
            </p>
          </div>
        </div>

        <section className="container py-8 md:py-12">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Filter chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {TIERS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { setTier(t.id); setVisible(24); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                      tier === t.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    }`}
                  >
                    <Tag className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Top deal feature card */}
              {topDeal && tier === 'all' && (
                <Link
                  to={`/local-product/${topDeal.id}`}
                  className="block mb-10 group"
                >
                  <div className="relative grid md:grid-cols-2 gap-6 bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors">
                    <div className="aspect-[4/3] md:aspect-auto bg-secondary overflow-hidden">
                      {topDeal.image_url && (
                        <img
                          src={topDeal.image_url}
                          alt={topDeal.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>
                    <div className="p-6 md:p-10 flex flex-col justify-center">
                      <span className="inline-flex items-center gap-1 self-start px-3 py-1 bg-destructive text-destructive-foreground text-xs font-bold rounded mb-4">
                        <Flame className="h-3 w-3" />
                        TOP DEAL
                      </span>
                      <p className="text-sm text-muted-foreground mb-2">{topDeal.category}</p>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-accent transition-colors">
                        {topDeal.name}
                      </h2>
                      <div className="flex items-baseline gap-3 mb-4">
                        <span className="text-3xl md:text-4xl font-bold">
                          ₹{topDeal.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-lg text-muted-foreground line-through">
                          ₹{topDeal.original_price!.toLocaleString('en-IN')}
                        </span>
                        <span className="text-lg font-bold text-destructive">
                          {(topDeal as any).discountPct}% OFF
                        </span>
                      </div>
                      <Button size="lg" className="self-start">Shop now</Button>
                    </div>
                  </div>
                </Link>
              )}

              {/* Results header */}
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground">
                  {sorted.length} deal{sorted.length === 1 ? '' : 's'} available
                </p>
              </div>

              {/* Grid */}
              {sorted.length === 0 ? (
                <div className="text-center py-16 bg-secondary/30 rounded-lg">
                  <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No deals match this filter yet.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                    {sorted.slice(0, visible).map((product, index) => (
                      <div
                        key={product.id}
                        className="animate-fade-in"
                        style={{ animationDelay: `${index * 25}ms` }}
                      >
                        <LocalProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {visible < sorted.length && (
                    <div className="flex justify-center mt-12">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setVisible((v) => v + 24)}
                      >
                        Load more deals
                      </Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}