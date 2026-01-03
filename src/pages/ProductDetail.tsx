import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Heart, Minus, Plus, ShoppingBag, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { products } from '@/data/products';
import { useStore } from '@/lib/store';
import { toast } from 'sonner';
import { ProductCard } from '@/components/ProductCard';

export default function ProductDetail() {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(
    product?.variants?.[0]?.color || product?.variants?.[0]?.size || null
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/">
            <Button>Go back to shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const relatedProducts = products.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    toast.success('Added to cart', {
      description: `${quantity}x ${product.name}`,
    });
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

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
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
            {product.badge && (
              <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                {product.badge}
              </Badge>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-accent font-medium uppercase tracking-wider mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-accent text-accent'
                        : 'text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="font-medium">{product.rating}</span>
              <span className="text-muted-foreground">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Save {discount}%
                  </Badge>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            <Separator />

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">
                  {product.variants[0].color ? 'Color' : 'Size'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => {
                    const value = variant.color || variant.size;
                    return (
                      <Button
                        key={index}
                        variant={selectedVariant === value ? 'default' : 'outline'}
                        className={selectedVariant === value ? 'bg-primary text-primary-foreground' : ''}
                        onClick={() => setSelectedVariant(value || null)}
                      >
                        {value}
                      </Button>
                    );
                  })}
                </div>
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
                  {product.inStock ? 'In stock' : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  toggleWishlist(product);
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-24">
            <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
