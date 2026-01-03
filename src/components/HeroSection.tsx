import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBanner from '@/assets/hero-banner.jpg';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-secondary">
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="Premium lifestyle products"
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>
      
      <div className="container relative z-10 py-24 md:py-32 lg:py-40">
        <div className="max-w-xl space-y-6 animate-fade-in">
          <span className="inline-block px-4 py-1.5 text-sm font-medium bg-accent text-accent-foreground">
            New Collection 2025
          </span>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Discover
            <br />
            <span className="text-muted-foreground">Extraordinary</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-md">
            Curated collection of premium products designed for those who appreciate quality and elegance.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Shop Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-foreground hover:bg-primary hover:text-primary-foreground">
              Explore Collection
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
