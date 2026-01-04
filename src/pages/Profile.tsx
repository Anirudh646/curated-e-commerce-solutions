import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, LogOut, Edit2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
}

interface Order {
  id: string;
  status: string;
  total: number;
  items: unknown;
  created_at: string;
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchOrders();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name || '',
          phone: data.phone || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      toast.success('Profile updated successfully');
      setEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Account</h1>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Wishlist
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="bg-card border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Personal Information</h2>
                  {!editing ? (
                    <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(false)}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleUpdateProfile} disabled={saving}>
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    {editing ? (
                      <Input
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      />
                    ) : (
                      <p className="text-foreground">{profile?.full_name || 'Not set'}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <p className="text-foreground">{profile?.email}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Phone</Label>
                    {editing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <p className="text-foreground">{profile?.phone || 'Not set'}</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <Button
                variant="outline"
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="bg-card border border-border p-6">
                <h2 className="text-xl font-semibold mb-6">Order History</h2>
                
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Link to="/">
                      <Button>Start Shopping</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="border border-border p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-sm font-medium ${
                            order.status === 'completed' ? 'bg-success/10 text-success' :
                            order.status === 'pending' ? 'bg-warning/10 text-warning' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              <div className="bg-card border border-border p-6">
                <h2 className="text-xl font-semibold mb-6">My Wishlist</h2>
                <div className="text-center py-12">
                  <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Your wishlist is synced locally. View your saved items on the{' '}
                    <Link to="/wishlist" className="text-accent hover:underline">
                      wishlist page
                    </Link>
                    .
                  </p>
                  <Link to="/wishlist">
                    <Button variant="outline">View Wishlist</Button>
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
