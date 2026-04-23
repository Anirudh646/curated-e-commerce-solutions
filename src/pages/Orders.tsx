import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Loader2,
  Package,
  ChevronRight,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  PackageCheck,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';

interface OrderItem {
  name?: string;
  quantity?: number;
  price?: number;
  image?: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  items: OrderItem[] | unknown;
  shipping_address: any;
  created_at: string;
}

const STATUS_FLOW = ['pending', 'processing', 'shipped', 'delivered'] as const;

const statusMeta: Record<
  string,
  { label: string; color: string; icon: typeof Clock }
> = {
  pending: { label: 'Order Placed', color: 'bg-warning/15 text-warning border-warning/30', icon: Clock },
  processing: { label: 'Processing', color: 'bg-primary/15 text-primary border-primary/30', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-accent/15 text-accent border-accent/30', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-success/15 text-success border-success/30', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'bg-destructive/15 text-destructive border-destructive/30', icon: XCircle },
  completed: { label: 'Completed', color: 'bg-success/15 text-success border-success/30', icon: PackageCheck },
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function StatusTimeline({ status }: { status: string }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 text-destructive text-sm font-medium">
        <XCircle className="h-5 w-5" />
        Order cancelled
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(status as typeof STATUS_FLOW[number]);
  const activeIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="flex items-center justify-between gap-1 md:gap-2">
      {STATUS_FLOW.map((step, i) => {
        const meta = statusMeta[step];
        const Icon = meta.icon;
        const reached = i <= activeIdx;
        const current = i === activeIdx;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${
                  reached
                    ? 'bg-primary border-primary text-primary-foreground'
                    : 'bg-background border-border text-muted-foreground'
                } ${current ? 'ring-2 ring-primary/30' : ''}`}
              >
                <Icon className="h-4 w-4" />
              </div>
              <span
                className={`text-[10px] md:text-xs font-medium text-center ${
                  reached ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {meta.label}
              </span>
            </div>
            {i < STATUS_FLOW.length - 1 && (
              <div
                className={`h-0.5 flex-1 mx-1 mt-[-18px] transition-colors ${
                  i < activeIdx ? 'bg-primary' : 'bg-border'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user!.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setOrders((data || []) as Order[]);
      } catch (e) {
        console.error('Error loading orders:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 md:py-12">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">My Orders</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-bold mb-8">My Orders</h1>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-secondary/30 rounded-lg">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-6">
              When you place an order, you'll be able to track it here.
            </p>
            <Link to="/">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const meta = statusMeta[order.status] || statusMeta.pending;
              const items = Array.isArray(order.items) ? (order.items as OrderItem[]) : [];
              const itemCount = items.reduce((s, it) => s + (it.quantity || 1), 0);

              return (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-lg overflow-hidden"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-3 p-4 md:p-6 border-b border-border bg-secondary/20">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Order placed
                      </p>
                      <p className="font-medium">
                        {format(new Date(order.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Total
                      </p>
                      <p className="font-semibold">{formatPrice(order.total)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Order #
                      </p>
                      <p className="font-mono text-sm">{order.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                    <Badge variant="outline" className={meta.color}>
                      {meta.label}
                    </Badge>
                  </div>

                  {/* Timeline */}
                  <div className="p-4 md:p-6 border-b border-border">
                    <StatusTimeline status={order.status} />
                  </div>

                  {/* Items */}
                  <div className="p-4 md:p-6">
                    {items.length > 0 ? (
                      <div className="space-y-3">
                        {items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            {item.image && (
                              <div className="h-14 w-14 bg-secondary overflow-hidden flex-shrink-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{item.name || 'Product'}</p>
                              <p className="text-sm text-muted-foreground">
                                Qty: {item.quantity || 1}
                                {item.price ? ` · ${formatPrice(item.price)}` : ''}
                              </p>
                            </div>
                          </div>
                        ))}
                        {items.length > 3 && (
                          <p className="text-sm text-muted-foreground">
                            +{items.length - 3} more item{items.length - 3 === 1 ? '' : 's'}
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {itemCount} item{itemCount === 1 ? '' : 's'}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}