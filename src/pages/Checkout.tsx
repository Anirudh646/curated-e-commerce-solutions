import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Loader2, Lock, Smartphone, Truck } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useStore } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const formatPrice = (amount: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

type PaymentMethod = 'card' | 'upi' | 'cod';

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [placing, setPlacing] = useState(false);
  const [payment, setPayment] = useState<PaymentMethod>('card');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [upiId, setUpiId] = useState('');

  const subtotal = getCartTotal();
  const shipping = subtotal > 500 ? 0 : 50;
  const codFee = payment === 'cod' ? 30 : 0;
  const total = subtotal + shipping + codFee;

  useEffect(() => {
    if (!user) return;
    supabase
      .from('profiles')
      .select('full_name, email, phone')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setForm((f) => ({
          ...f,
          fullName: f.fullName || data?.full_name || '',
          email: f.email || data?.email || user.email || '',
          phone: f.phone || data?.phone || '',
        }));
      });
  }, [user]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const errors = useMemo(() => {
    const e: string[] = [];
    if (!form.fullName.trim()) e.push('Full name');
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.push('A valid email');
    if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) e.push('A 10-digit phone number');
    if (!form.line1.trim()) e.push('Address');
    if (!form.city.trim()) e.push('City');
    if (!form.state.trim()) e.push('State');
    if (!/^\d{6}$/.test(form.pincode.trim())) e.push('A 6-digit PIN code');
    if (payment === 'card') {
      if (card.number.replace(/\D/g, '').length < 12) e.push('Card number');
      if (!/^\d{2}\/\d{2}$/.test(card.expiry)) e.push('Card expiry (MM/YY)');
      if (!/^\d{3,4}$/.test(card.cvv)) e.push('Card CVV');
    }
    if (payment === 'upi' && !/^[\w.-]+@[\w.-]+$/.test(upiId)) e.push('A valid UPI ID');
    return e;
  }, [form, card, upiId, payment]);

  const placeOrder = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (errors.length) {
      toast.error(`Please add: ${errors.join(', ')}`);
      return;
    }

    setPlacing(true);
    try {
      const items = cart.map((item) => ({
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
          items,
          total,
          status: 'pending',
          shipping_address: {
            full_name: form.fullName,
            email: form.email,
            phone: form.phone,
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            payment_method: payment,
            payment_reference:
              payment === 'card'
                ? `card ****${card.number.replace(/\D/g, '').slice(-4)}`
                : payment === 'upi'
                ? upiId
                : 'Cash on delivery',
            shipping_fee: shipping,
            cod_fee: codFee,
          },
        })
        .select()
        .single();

      if (error) throw error;

      try {
        await supabase.functions.invoke('send-order-confirmation', {
          body: {
            email: form.email,
            customerName: form.fullName,
            orderId: order.id,
            items: cart.map((i) => ({ title: i.name, quantity: i.quantity, price: i.price })),
            total,
            currency: 'INR',
          },
        });
      } catch (emailErr) {
        console.error('Confirmation email failed:', emailErr);
      }

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (e: any) {
      console.error('Order failed:', e);
      toast.error(e.message || 'We could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-muted-foreground mb-6">Add something you love before checking out.</p>
          <Link to="/">
            <Button size="lg">Continue Shopping</Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <Link to="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping */}
            <section className="bg-card border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-accent" /> Shipping details
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input id="fullName" value={form.fullName} onChange={set('fullName')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} onChange={set('email')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" inputMode="numeric" value={form.phone} onChange={set('phone')} placeholder="10-digit mobile" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN code</Label>
                  <Input id="pincode" inputMode="numeric" value={form.pincode} onChange={set('pincode')} placeholder="560001" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="line1">Address</Label>
                  <Input id="line1" value={form.line1} onChange={set('line1')} placeholder="House no, street" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="line2">Landmark (optional)</Label>
                  <Input id="line2" value={form.line2} onChange={set('line2')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={set('city')} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={set('state')} />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="bg-card border border-border p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-accent" /> Payment
              </h2>
              <RadioGroup value={payment} onValueChange={(v) => setPayment(v as PaymentMethod)} className="space-y-3">
                <label className="flex items-center gap-3 border border-border p-3 cursor-pointer">
                  <RadioGroupItem value="card" id="pay-card" />
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span>Credit / Debit card</span>
                </label>
                {payment === 'card' && (
                  <div className="grid sm:grid-cols-2 gap-4 pl-2">
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="cardNumber">Card number</Label>
                      <Input
                        id="cardNumber"
                        inputMode="numeric"
                        value={card.number}
                        onChange={(e) => setCard({ ...card, number: e.target.value })}
                        placeholder="4111 1111 1111 1111"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiry (MM/YY)</Label>
                      <Input
                        id="cardExpiry"
                        value={card.expiry}
                        onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                        placeholder="09/29"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvv">CVV</Label>
                      <Input
                        id="cardCvv"
                        inputMode="numeric"
                        value={card.cvv}
                        onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                        placeholder="123"
                      />
                    </div>
                  </div>
                )}

                <label className="flex items-center gap-3 border border-border p-3 cursor-pointer">
                  <RadioGroupItem value="upi" id="pay-upi" />
                  <Smartphone className="h-4 w-4 text-muted-foreground" />
                  <span>UPI</span>
                </label>
                {payment === 'upi' && (
                  <div className="space-y-2 pl-2">
                    <Label htmlFor="upi">UPI ID</Label>
                    <Input id="upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="name@bank" />
                  </div>
                )}

                <label className="flex items-center gap-3 border border-border p-3 cursor-pointer">
                  <RadioGroupItem value="cod" id="pay-cod" />
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <span>Cash on delivery (+{formatPrice(30)})</span>
                </label>
              </RadioGroup>
              <p className="text-xs text-muted-foreground mt-4">
                No real money is charged yet — card and UPI details are used only to record the order until a payment
                provider is connected.
              </p>
            </section>
          </div>

          {/* Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-card border border-border p-6 sticky top-24 space-y-4">
              <h2 className="text-lg font-semibold">Order summary</h2>
              <div className="space-y-3 max-h-64 overflow-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {item.image && (
                      <img src={item.image} alt={item.name} className="h-12 w-12 object-cover bg-secondary" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {codFee > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cash on delivery fee</span>
                    <span>{formatPrice(codFee)}</span>
                  </div>
                )}
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <Button className="w-full" size="lg" onClick={placeOrder} disabled={placing}>
                {placing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing order...
                  </>
                ) : (
                  <>Place order · {formatPrice(total)}</>
                )}
              </Button>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
