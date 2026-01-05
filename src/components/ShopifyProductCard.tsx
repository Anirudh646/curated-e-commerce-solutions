import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShopifyProduct, CartItem } from '@/lib/shopify';
import { useShopifyCartStore } from '@/stores/shopifyCartStore';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

interface ShopifyProductCardProps {
  product: ShopifyProduct;
}

export function ShopifyProductCard({ product }: ShopifyProductCardProps) {
  const { addItem } = useShopifyCartStore();
  const { toggleWishlist, isInWishlist } = useStore();
  
  const productNode = product.node;
  const firstVariant = productNode.variants.edges[0]?.node;
  const firstImage = productNode.images.edges[0]?.node;
  const price = parseFloat(productNode.priceRange.minVariantPrice.amount);
  const currencyCode = productNode.priceRange.minVariantPrice.currencyCode;
  
  // Create a compatible product for wishlist
  const wishlistProduct = {
    id: productNode.id,
    name: productNode.title,
    price: price,
    image: firstImage?.url || '',
    category: 'Shopify',
    rating: 0,
    reviews: 0,
    description: productNode.description,
    inStock: firstVariant?.availableForSale ?? true,
  };
  
  const inWishlist = isInWishlist(productNode.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!firstVariant) return;
    
    const cartItem: CartItem = {
      product,
      variantId: firstVariant.id,
      variantTitle: firstVariant.title,
      price: firstVariant.price,
      quantity: 1,
      selectedOptions: firstVariant.selectedOptions || [],
    };
    
    addItem(cartItem);
    toast.success('Added to cart', {
      description: productNode.title,
      position: 'top-center',
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleWishlist(wishlistProduct);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      description: productNode.title,
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <Link to={`/product/${productNode.handle}`} className="group block">
      <div className="relative overflow-hidden bg-secondary aspect-square">
        {firstImage ? (
          <img
            src={firstImage.url}
            alt={firstImage.altText || productNode.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-muted-foreground">
            No Image
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
        <h3 className="font-medium text-foreground group-hover:text-accent transition-colors line-clamp-2">
          {productNode.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold">{formatPrice(price, currencyCode)}</span>
        </div>
      </div>
    </Link>
  );
}
