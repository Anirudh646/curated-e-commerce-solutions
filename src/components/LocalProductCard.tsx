import { useState } from 'react';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { QuickViewModal } from '@/components/QuickViewModal';
import { CompareButton } from '@/components/CompareButton';

interface LocalProduct {
  id: string;
  name: string;
  price: number;
  original_price?: number | null;
  image_url?: string | null;
  images?: string[];
  category: string;
  rating?: number | null;
  reviews_count?: number | null;
  badge?: string | null;
  stock: number;
  description?: string | null;
}

interface LocalProductCardProps {
  product: LocalProduct;
  onImageClick?: () => void;
}

export function LocalProductCard({ product, onImageClick }: LocalProductCardProps) {
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toggleWishlist, isInWishlist, addToCart, addToRecentlyViewed } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const wishlistProduct = {
    id: product.id,
    name: product.name,
    price: product.price,
    image: product.image_url || product.images?.[0] || '',
    category: product.category,
    rating: product.rating || 0,
    reviews: product.reviews_count || 0,
    description: product.description || '',
    inStock: product.stock > 0,
  };
  
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth');
      return;
    }
    addToCart(wishlistProduct);
    toast.success('Added to cart', {
      description: product.name,
      position: 'top-center',
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to use wishlist');
      navigate('/auth');
      return;
    }
    toggleWishlist(wishlistProduct);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      description: product.name,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    setQuickViewOpen(true);
  };

  const handleImageClick = () => {
    addToRecentlyViewed({
      ...product,
      viewedAt: Date.now(),
    });
    onImageClick?.();
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

  const mainImage = product.image_url || product.images?.[0];

  return (
    <>
      <Link 
        to={`/local-product/${product.id}`} 
        className="group block"
        onClick={handleImageClick}
      >
        <div 
          className="relative overflow-hidden bg-secondary aspect-square"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className={`h-full w-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}

          {/* Badge */}
          {product.badge && (
            <span className="absolute top-3 left-3 bg-accent text-accent-foreground px-2 py-1 text-xs font-medium">
              {product.badge}
            </span>
          )}

          {/* Discount Badge */}
          {discountPercent && (
            <span className="absolute top-3 right-12 bg-destructive text-destructive-foreground px-2 py-1 text-xs font-medium">
              -{discountPercent}%
            </span>
          )}

          {/* Out of Stock */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-lg font-semibold text-muted-foreground">Out of Stock</span>
            </div>
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
              onClick={handleQuickView}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <CompareButton
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                original_price: product.original_price,
                image_url: product.image_url || product.images?.[0],
                category: product.category,
                rating: product.rating,
                reviews_count: product.reviews_count,
                badge: product.badge,
                stock: product.stock,
              }}
              className="h-9 w-9 bg-background/90 backdrop-blur hover:bg-accent hover:text-accent-foreground"
            />
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 bg-background/90 backdrop-blur hover:bg-accent hover:text-accent-foreground"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </div>

          {/* Quick Add */}
          <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            <Button
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-2">
          <h3 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
          
          {/* Rating */}
          {product.rating !== null && product.rating !== undefined && product.rating > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-yellow-500">★</span>
              <span>{product.rating.toFixed(1)}</span>
              {product.reviews_count !== null && product.reviews_count !== undefined && (
                <span className="text-muted-foreground">({product.reviews_count})</span>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold">{formatPrice(product.price)}</span>
            {product.original_price && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      <QuickViewModal
        product={product}
        open={quickViewOpen}
        onOpenChange={setQuickViewOpen}
      />
    </>
  );
}
