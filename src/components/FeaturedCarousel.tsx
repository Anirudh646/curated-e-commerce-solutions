import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LocalProductCard } from '@/components/LocalProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FeaturedProduct {
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

export function FeaturedCarousel() {
  const [bestsellers, setBestsellers] = useState<FeaturedProduct[]>([]);
  const [newArrivals, setNewArrivals] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        setLoading(true);
        
        // Fetch bestsellers (top rated with most reviews)
        const { data: bestsellersData } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('reviews_count', { ascending: false })
          .order('rating', { ascending: false })
          .limit(12);

        // Fetch new arrivals (most recent)
        const { data: newArrivalsData } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(12);

        setBestsellers(bestsellersData || []);
        setNewArrivals(newArrivalsData || []);
      } catch (error) {
        console.error('Error loading featured products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFeaturedProducts();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </section>
    );
  }

  if (bestsellers.length === 0 && newArrivals.length === 0) {
    return null;
  }

  const renderCarousel = (products: FeaturedProduct[]) => (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((product) => (
          <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
            <LocalProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden md:flex -left-4 bg-background border-border" />
      <CarouselNext className="hidden md:flex -right-4 bg-background border-border" />
    </Carousel>
  );

  return (
    <section className="py-12 md:py-16 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-8">
          <span className="text-sm font-medium text-accent uppercase tracking-wider">
            Handpicked for You
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Featured Products
          </h2>
        </div>

        <Tabs defaultValue="bestsellers" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="bestsellers">Bestsellers</TabsTrigger>
            <TabsTrigger value="new-arrivals">New Arrivals</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bestsellers" className="mt-0">
            {renderCarousel(bestsellers)}
          </TabsContent>
          
          <TabsContent value="new-arrivals" className="mt-0">
            {renderCarousel(newArrivals)}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
