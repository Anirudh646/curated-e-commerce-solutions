import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-bold">LUXE</span>
              <span className="text-2xl font-light opacity-70">STORE</span>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed">
              Your destination for premium products. Quality meets elegance in every item we curate.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-primary-foreground/10">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Home</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Shop</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">About Us</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Contact</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-3 text-sm opacity-80">
              <li><Link to="/" className="hover:opacity-100 transition-opacity">FAQ</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Shipping Info</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Returns</Link></li>
              <li><Link to="/" className="hover:opacity-100 transition-opacity">Track Order</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm opacity-80 mb-4">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-primary-foreground/10 border-primary-foreground/20 placeholder:text-primary-foreground/50"
              />
              <Button variant="secondary" className="shrink-0">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm opacity-60">
          <p>© 2025 LuxeStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
