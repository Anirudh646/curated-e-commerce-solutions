import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LocalProductCard } from '@/components/LocalProductCard';
import { ProductFilters, FilterState } from '@/components/ProductFilters';
import { ProductComparison } from '@/components/ProductComparison';
import { CompareFloatingBar } from '@/components/CompareFloatingBar';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Package, ChevronRight } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '@/components/ui/pagination';

interface Product {
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

const PRODUCTS_PER_PAGE = 12;

const categoryDescriptions: Record<string, string> = {
  Fashion: 'Discover the latest trends in Indian fashion - from traditional sarees to modern casual wear.',
  Electronics: 'Shop the best electronics and gadgets with the latest technology at great prices.',
  Home: 'Transform your living space with our curated home décor and essentials.',
  Accessories: 'Complete your look with stylish accessories - bags, jewelry, and more.',
  Sports: 'Gear up for your active lifestyle with quality sports and fitness equipment.',
  Beauty: 'Explore premium skincare, makeup, and beauty essentials for every skin type.',
  Kitchen: 'Find the best cookware, appliances, and kitchen essentials for Indian cooking.',
  Books: 'Discover bestsellers, academic texts, and captivating reads across all genres.',
  Toys: 'Fun and educational toys for children of all ages - safe and engaging.',
  Footwear: 'Step out in style with shoes, sandals, and sneakers for every occasion.',
  Groceries: 'Shop fresh groceries, spices, and pantry staples delivered to your door.',
  Automotive: 'Premium car accessories, tools, and auto care products for every vehicle.',
  'Health & Wellness': 'Supplements, fitness gear, and wellness products for a healthier you.',
  Stationery: 'Quality pens, notebooks, art supplies, and office essentials.',
  'Pet Supplies': 'Everything your furry friend needs - food, toys, grooming, and more.',
  'Garden & Outdoor': 'Plants, garden tools, and outdoor living essentials for green thumbs.',
};

const categoryImages: Record<string, string> = {
  Fashion: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=400&fit=crop',
  Electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop',
  Home: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop',
  Accessories: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=1200&h=400&fit=crop',
  Sports: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&h=400&fit=crop',
  Beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=400&fit=crop',
  Kitchen: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&h=400&fit=crop',
  Books: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&h=400&fit=crop',
  Toys: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=1200&h=400&fit=crop',
  Footwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&h=400&fit=crop',
  Groceries: 'https://images.unsplash.com/photo-1506617420156-8e4536971650?w=1200&h=400&fit=crop',
  Automotive: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200&h=400&fit=crop',
  'Health & Wellness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&h=400&fit=crop',
  Stationery: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?w=1200&h=400&fit=crop',
  'Pet Supplies': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=1200&h=400&fit=crop',
  'Garden & Outdoor': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=400&fit=crop',
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: 'all',
    priceRange: [0, 100000],
    sortBy: 'newest',
    minRating: 0,
    inStockOnly: false,
    brand: 'all',
  });

  const decodedCategory = category ? decodeURIComponent(category) : '';

  useEffect(() => {
    async function loadProducts() {
      if (!decodedCategory) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .eq('category', decodedCategory)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
    setCurrentPage(1);
  }, [decodedCategory]);

  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach(p => {
      const firstWord = p.name.split(' ')[0];
      if (firstWord) brandSet.add(firstWord);
    });
    return [...brandSet].sort().slice(0, 50);
  }, [products]);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 100000;
    return Math.ceil(Math.max(...products.map(p => p.price)) / 1000) * 1000;
  }, [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    result = result.filter(p =>
      p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.minRating > 0) {
      result = result.filter(p => (p.rating || 0) >= filters.minRating);
    }

    if (filters.inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    if (filters.brand !== 'all') {
      result = result.filter(p => p.name.startsWith(filters.brand));
    }

    switch (filters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'discount':
        result.sort((a, b) => {
          const discA = a.original_price ? (a.original_price - a.price) / a.original_price : 0;
          const discB = b.original_price ? (b.original_price - b.price) / b.original_price : 0;
          return discB - discA;
        });
        break;
      default:
        break;
    }

    return result;
  }, [products, filters]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Banner */}
        <div 
          className="relative h-48 md:h-64 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to right, hsl(var(--background) / 0.9), hsl(var(--background) / 0.6)), url('${categoryImages[decodedCategory] || categoryImages.Fashion}')` 
          }}
        >
          <div className="container h-full flex flex-col justify-center">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground">{decodedCategory}</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold">{decodedCategory}</h1>
            <p className="text-muted-foreground mt-2 max-w-xl">
              {categoryDescriptions[decodedCategory] || `Explore our ${decodedCategory} collection.`}
            </p>
          </div>
        </div>

        <section className="py-8 md:py-12">
          <div className="container">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-secondary/50 rounded-lg">
                <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Check back soon for products in {decodedCategory}!
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing {paginatedProducts.length} of {filteredProducts.length} products
                    {filteredProducts.length !== products.length && (
                      <span className="ml-1">({products.length} total in {decodedCategory})</span>
                    )}
                  </p>
                </div>

                <ProductFilters
                  filters={{ ...filters, category: 'all' }}
                  onFiltersChange={(newFilters) => setFilters({ ...newFilters, category: 'all' })}
                  categories={[]}
                  maxPrice={maxPrice}
                  brands={brands}
                />

                {paginatedProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No products match your filters.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                      {paginatedProducts.map((product, index) => (
                        <div
                          key={product.id}
                          className="animate-fade-in"
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <LocalProductCard product={product} />
                        </div>
                      ))}
                    </div>

                    {totalPages > 1 && (
                      <Pagination className="mt-12">
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                          
                          {getPageNumbers().map((page, index) => (
                            <PaginationItem key={index}>
                              {page === 'ellipsis' ? (
                                <PaginationEllipsis />
                              ) : (
                                <PaginationLink
                                  onClick={() => handlePageChange(page)}
                                  isActive={currentPage === page}
                                  className="cursor-pointer"
                                >
                                  {page}
                                </PaginationLink>
                              )}
                            </PaginationItem>
                          ))}
                          
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <CompareFloatingBar />
      <ProductComparison />
    </div>
  );
}
