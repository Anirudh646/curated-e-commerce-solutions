import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Heart, Minus, Plus, ShoppingBag, Truck, Shield, RefreshCw, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { fetchProductByHandle, ShopifyProduct, CartItem } from '@/lib/shopify';
import { useShopifyCartStore } from '@/stores/shopifyCartStore';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';

export default function ShopifyProductDetail() {
  const { handle } = useParams();
  const [product, setProduct] = useState<ShopifyProduct['node'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  
  const { addItem } = useShopifyCartStore();
  const { toggleWishlist, isInWishlist } = useStore();

  useEffect(() => {
    async function loadProduct() {
      if (!handle) return;
      try {
        setLoading(true);
        const fetchedProduct = await fetchProductByHandle(handle);
        setProduct(fetchedProduct);
        if (fetchedProduct?.variants.edges[0]) {
          setSelectedVariant(fetchedProduct.variants.edges[0].node.id);
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [handle]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <Link to="/">
              <Button>Go back to shop</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const firstImage = product.images.edges[0]?.node;
  const currentVariant = product.variants.edges.find(v => v.node.id === selectedVariant)?.node 
    || product.variants.edges[0]?.node;
  const price = parseFloat(currentVariant?.price.amount || '0');
  const currencyCode = currentVariant?.price.currencyCode || 'USD';

  const wishlistProduct = {
    id: product.id,
    name: product.title,
    price: price,
    image: firstImage?.url || '',
    category: 'Shopify',
    rating: 0,
    reviews: 0,
    description: product.description,
    inStock: currentVariant?.availableForSale ?? true,
  };

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    if (!currentVariant) return;

    const cartItem: CartItem = {
      product: { node: product },
      variantId: currentVariant.id,
      variantTitle: currentVariant.title,
      price: currentVariant.price,
      quantity: quantity,
      selectedOptions: currentVariant.selectedOptions || [],
    };

    addItem(cartItem);
    toast.success('Added to cart', {
      description: `${quantity}x ${product.title}`,
      position: 'top-center',
    });
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden bg-secondary">
            {firstImage ? (
              <img
                src={firstImage.url}
                alt={firstImage.altText || product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                No Image
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(price, currencyCode)}</span>
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <Separator />

            {/* Variants */}
            {product.options && product.options.length > 0 && product.options[0].name !== 'Title' && (
              <div className="space-y-3">
                {product.options.map((option) => (
                  <div key={option.name} className="space-y-2">
                    <label className="text-sm font-medium">{option.name}</label>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.edges.map((variant) => {
                        const optionValue = variant.node.selectedOptions.find(
                          (opt) => opt.name === option.name
                        )?.value;
                        
                        return (
                          <Button
                            key={variant.node.id}
                            variant={selectedVariant === variant.node.id ? 'default' : 'outline'}
                            className={selectedVariant === variant.node.id ? 'bg-primary text-primary-foreground' : ''}
                            onClick={() => setSelectedVariant(variant.node.id)}
                            disabled={!variant.node.availableForSale}
                          >
                            {optionValue || variant.node.title}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {currentVariant?.availableForSale ? 'In stock' : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleAddToCart}
                disabled={!currentVariant?.availableForSale}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  toggleWishlist(wishlistProduct);
                  toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
                }}
              >
                <Heart className={`h-5 w-5 ${inWishlist ? 'fill-accent text-accent' : ''}`} />
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6">
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-secondary">
                <Truck className="h-5 w-5 text-accent" />
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-secondary">
                <Shield className="h-5 w-5 text-accent" />
                <span className="text-xs font-medium">Secure Payment</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2 p-4 bg-secondary">
                <RefreshCw className="h-5 w-5 text-accent" />
                <span className="text-xs font-medium">30-Day Returns</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
