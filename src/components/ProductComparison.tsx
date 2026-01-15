import { X, Star, Check, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComparisonStore } from '@/stores/comparisonStore';
import { Link } from 'react-router-dom';

export function ProductComparison() {
  const { products, removeProduct, clearAll, isOpen, setIsOpen } = useComparisonStore();

  if (!isOpen || products.length === 0) return null;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const attributes = [
    { key: 'price', label: 'Price', render: (p: typeof products[0]) => formatPrice(p.price) },
    { key: 'original_price', label: 'Original Price', render: (p: typeof products[0]) => p.original_price ? formatPrice(p.original_price) : '-' },
    { key: 'discount', label: 'Discount', render: (p: typeof products[0]) => p.original_price ? `${Math.round((1 - p.price / p.original_price) * 100)}% off` : '-' },
    { key: 'category', label: 'Category', render: (p: typeof products[0]) => p.category },
    { key: 'rating', label: 'Rating', render: (p: typeof products[0]) => (
      <span className="flex items-center gap-1">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        {p.rating?.toFixed(1) || 'N/A'}
      </span>
    )},
    { key: 'reviews', label: 'Reviews', render: (p: typeof products[0]) => p.reviews_count || 0 },
    { key: 'stock', label: 'In Stock', render: (p: typeof products[0]) => (
      p.stock > 0 ? <Check className="h-4 w-4 text-green-500" /> : <Minus className="h-4 w-4 text-red-500" />
    )},
    { key: 'badge', label: 'Badge', render: (p: typeof products[0]) => p.badge || '-' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 md:inset-10 bg-card border border-border rounded-lg shadow-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Compare Products ({products.length})</h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={clearAll}>
              Clear All
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto p-4">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr>
                <th className="text-left p-3 bg-secondary/50 sticky left-0 min-w-[120px]">Feature</th>
                {products.map((product) => (
                  <th key={product.id} className="p-3 bg-secondary/50 min-w-[200px]">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-1 -right-1 h-6 w-6"
                        onClick={() => removeProduct(product.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Link to={`/local-product/${product.id}`}>
                        <img
                          src={product.image_url || '/placeholder.svg'}
                          alt={product.name}
                          className="w-24 h-24 object-cover mx-auto mb-2 rounded"
                        />
                        <p className="font-medium text-sm line-clamp-2 hover:text-primary">
                          {product.name}
                        </p>
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr.key} className="border-b border-border">
                  <td className="p-3 font-medium bg-secondary/30 sticky left-0">{attr.label}</td>
                  {products.map((product) => (
                    <td key={product.id} className="p-3 text-center">
                      {attr.render(product)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
