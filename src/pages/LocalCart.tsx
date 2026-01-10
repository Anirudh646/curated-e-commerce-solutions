import { Link, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function LocalCart() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/auth');
      return;
    }

    setIsCheckingOut(true);
    try {
      // Create order in database
      const orderItems = cart.map(item => ({
        product_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          items: orderItems,
          total: total,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Get user profile for email
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      // Send confirmation email
      try {
        const { error: emailError } = await supabase.functions.invoke('send-order-confirmation', {
          body: {
            email: profile?.email || user.email,
            customerName: profile?.full_name || 'Customer',
            orderId: order.id,
            items: cart.map(item => ({
              title: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            total: total,
            currency: 'INR',
          },
        });
        
        if (emailError) {
          console.error('Failed to send email:', emailError);
        }
      } catch (emailErr) {
        console.error('Email service error:', emailErr);
      }

      clearCart();
      toast.success('Order placed successfully!', {
        description: `Order #${order.id.slice(0, 8).toUpperCase()}`,
      });
      navigate('/profile');
    } catch (error: any) {
      console.error('Checkout failed:', error);
      toast.error('Checkout failed. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/">
              <Button className="bg-primary text-primary-foreground">
                Continue Shopping
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
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-6 p-4 bg-card border border-border">
                <Link to={`/local-product/${item.id}`} className="shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-secondary flex items-center justify-center text-muted-foreground text-sm">
                      No Image
                    </div>
                  )}
                </Link>
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between">
                    <div>
                      <Link
                        to={`/local-product/${item.id}`}
                        className="font-medium hover:text-accent transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => {
                        removeFromCart(item.id);
                        toast.success('Removed from cart');
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center border border-border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-10 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <span className="font-bold">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => {
                clearCart();
                toast.success('Cart cleared');
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {subtotal < 500 && (
                  <p className="text-xs text-muted-foreground">
                    Add {formatPrice(500 - subtotal)} more for free shipping
                  </p>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                size="lg"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>

              {!user && (
                <p className="text-xs text-center text-muted-foreground mt-4">
                  <Link to="/auth" className="text-primary hover:underline">
                    Sign in
                  </Link>{' '}
                  to checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
