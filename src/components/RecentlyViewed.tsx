import { useStore } from '@/lib/store';
import { LocalProductCard } from '@/components/LocalProductCard';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export function RecentlyViewed() {
  const { recentlyViewed } = useStore();

  if (recentlyViewed.length === 0) {
    return null;
  }

  return (
    <section className="py-12 md:py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-sm font-medium text-accent uppercase tracking-wider">
              Your History
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              Recently Viewed
            </h2>
          </div>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {recentlyViewed.map((product) => (
              <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                <LocalProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-4 bg-background border-border" />
          <CarouselNext className="hidden md:flex -right-4 bg-background border-border" />
        </Carousel>
      </div>
    </section>
  );
}
