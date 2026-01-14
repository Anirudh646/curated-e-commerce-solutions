import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, Minus, Plus, ShoppingBag, X, ExternalLink } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface QuickViewProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  category: string;
  rating?: number | null;
  reviews_count?: number | null;
  badge?: string | null;
  stock: number;
  description?: string | null;
}

interface QuickViewModalProps {
  product: QuickViewProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  const [quantity, setQuantity] = useState(1);
  const { toggleWishlist, isInWishlist, addToCart, addToRecentlyViewed } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!product) return null;

  const wishlistProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image_url || '',
    category: product.category,
    rating: product.rating || 0,
    reviews: product.reviews_count || 0,
    description: product.description || '',
    inStock: product.stock > 0,
  };

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      onOpenChange(false);
      navigate('/auth');
      return;
    }
    for (let i = 0; i < quantity; i++) {
      addToCart(wishlistProduct);
    }
    toast.success('Added to cart', {
      description: `${quantity}x ${product.name}`,
      position: 'top-center',
    });
    onOpenChange(false);
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error('Please sign in to use wishlist');
      onOpenChange(false);
      navigate('/auth');
      return;
    }
    toggleWishlist(wishlistProduct);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleViewDetails = () => {
    addToRecentlyViewed({
      ...product,
      viewedAt: Date.now(),
    });
    onOpenChange(false);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-full bg-background/80 p-2 hover:bg-background transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image */}
          <div className="relative aspect-square bg-secondary">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
            {product.badge && (
              <span className="absolute top-4 left-4 bg-accent text-accent-foreground px-3 py-1 text-sm font-medium">
                {product.badge}
              </span>
            )}
            {discountPercent && (
              <span className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-2 py-1 text-sm font-medium">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Details */}
          <div className="p-6 flex flex-col">
            <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
            <h2 className="text-xl font-bold mb-2 line-clamp-2">{product.name}</h2>

            {/* Rating */}
            {product.rating !== null && product.rating !== undefined && product.rating > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(product.rating!) ? 'text-yellow-500' : 'text-muted'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.reviews_count || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.original_price && (
                <span className="text-muted-foreground line-through">
                  {formatPrice(product.original_price)}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {product.description}
              </p>
            )}

            {/* Stock */}
            <p className="text-sm mb-4">
              {product.stock > 0 ? (
                <span className="text-green-600">✓ In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-destructive">Out of Stock</span>
              )}
            </p>

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center border border-border rounded">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <Button
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleWishlist}
              >
                <Heart className={`h-4 w-4 ${inWishlist ? 'fill-accent text-accent' : ''}`} />
              </Button>
            </div>

            {/* View Details Link */}
            <Link
              to={`/local-product/${product.id}`}
              onClick={handleViewDetails}
              className="flex items-center justify-center gap-2 mt-3 text-sm text-accent hover:underline"
            >
              View Full Details
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
