import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Minus, Plus, ShoppingBag, Truck, Shield, RefreshCw, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';
import { useStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface ProductImage {
  id: string;
  image_url: string;
  display_order: number;
  alt_text: string | null;
}

interface LocalProduct {
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

export default function LocalProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<LocalProduct | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const { toggleWishlist, isInWishlist, addToCart } = useStore();
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      try {
        setLoading(true);
        
        // Fetch product
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('is_active', true)
          .single();

        if (productError) throw productError;
        setProduct(productData);

        // Fetch product images
        const { data: imagesData } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', id)
          .order('display_order', { ascending: true });

        setImages(imagesData || []);
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

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

  // Combine main image with gallery images
  const allImages = [
    ...(product.image_url ? [{ id: 'main', image_url: product.image_url, display_order: -1, alt_text: product.name }] : []),
    ...images,
  ];

  const currentImage = allImages[selectedImage]?.image_url;

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
  };

  const handleToggleWishlist = () => {
    if (!user) {
      toast.error('Please sign in to use wishlist');
      navigate('/auth');
      return;
    }
    toggleWishlist(wishlistProduct);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Breadcrumb */}
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to shop
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden bg-secondary">
              {currentImage ? (
                <img
                  src={currentImage}
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
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(index)}
                    className={`shrink-0 w-20 h-20 border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img.image_url}
                      alt={img.alt_text || `Product image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
            </div>

            {/* Rating */}
            {product.rating !== null && product.rating > 0 && (
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={i < Math.round(product.rating!) ? 'text-yellow-500' : 'text-muted'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)} ({product.reviews_count || 0} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.original_price && (
                <>
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.original_price)}
                  </span>
                  <span className="text-sm bg-destructive text-destructive-foreground px-2 py-1">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <Separator />

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
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                size="lg"
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleToggleWishlist}
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
                <span className="text-xs font-medium">Easy Returns</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
