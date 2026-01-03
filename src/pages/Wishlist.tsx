import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { useStore } from '@/lib/store';

export default function Wishlist() {
  const { wishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="text-center max-w-md mx-auto">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold mb-2">Your wishlist is empty</h1>
            <p className="text-muted-foreground mb-6">
              Save your favorite items here to buy them later.
            </p>
            <Link to="/">
              <Button className="bg-primary text-primary-foreground">
                Explore Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
        <p className="text-muted-foreground mb-8">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {wishlist.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
