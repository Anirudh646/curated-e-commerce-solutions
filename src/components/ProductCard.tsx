import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, useStore } from '@/lib/store';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart', {
      description: product.name,
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(product);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      description: product.name,
    });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden bg-secondary aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Badge */}
        {product.badge && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
            {product.badge}
          </Badge>
        )}

        {/* Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 bg-background/90 backdrop-blur hover:bg-accent hover:text-accent-foreground"
            onClick={handleToggleWishlist}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-accent text-accent' : ''}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-9 w-9 bg-background/90 backdrop-blur hover:bg-accent hover:text-accent-foreground"
            onClick={handleAddToCart}
          >
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Add */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
          <Button
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-sm text-muted-foreground">({product.reviews})</span>
        </div>
        <h3 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
              <span className="text-sm text-success font-medium">-{discount}%</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
