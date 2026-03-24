import { useState } from 'react';
import { Search, SlidersHorizontal, X, Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export interface FilterState {
  search: string;
  category: string;
  priceRange: [number, number];
  sortBy: string;
  minRating: number;
  inStockOnly: boolean;
  brand: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: string[];
  maxPrice: number;
  brands?: string[];
}

export function ProductFilters({ filters, onFiltersChange, categories, maxPrice, brands = [] }: ProductFiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: 'all',
      priceRange: [0, maxPrice],
      sortBy: 'newest',
      minRating: 0,
      inStockOnly: false,
      brand: 'all',
    });
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice ||
    filters.sortBy !== 'newest' ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.brand !== 'all';

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category */}
      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={filters.category} onValueChange={(v) => updateFilter('category', v)}>
          <SelectTrigger>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      {brands.length > 0 && (
        <div className="space-y-2">
          <Label>Brand</Label>
          <Select value={filters.brand} onValueChange={(v) => updateFilter('brand', v)}>
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>{brand}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Price Range */}
      <div className="space-y-3">
        <Label>Price Range: ₹{filters.priceRange[0].toLocaleString('en-IN')} - ₹{filters.priceRange[1].toLocaleString('en-IN')}</Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(v) => updateFilter('priceRange', v as [number, number])}
          min={0}
          max={maxPrice}
          step={100}
          className="mt-2"
        />
      </div>

      {/* Minimum Rating */}
      <div className="space-y-3">
        <Label>Minimum Rating</Label>
        <div className="flex gap-2">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant={filters.minRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilter('minRating', rating)}
              className="text-xs"
            >
              {rating === 0 ? 'Any' : (
                <span className="flex items-center gap-0.5">
                  {rating}+ <Star className="h-3 w-3 fill-current" />
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* In Stock Only */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={filters.inStockOnly}
          onCheckedChange={(checked) => updateFilter('inStockOnly', checked === true)}
        />
        <Label htmlFor="inStock" className="cursor-pointer">In Stock Only</Label>
      </div>

      {/* Sort */}
      <div className="space-y-2">
        <Label>Sort By</Label>
        <Select value={filters.sortBy} onValueChange={(v) => updateFilter('sortBy', v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="discount">Biggest Discount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="mb-8 space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products, brands..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Desktop Filters */}
        <div className="hidden md:flex gap-3">
          <Select value={filters.category} onValueChange={(v) => updateFilter('category', v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {brands.length > 0 && (
            <Select value={filters.brand} onValueChange={(v) => updateFilter('brand', v)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                {brands.slice(0, 20).map((brand) => (
                  <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={filters.sortBy} onValueChange={(v) => updateFilter('sortBy', v)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="discount">Biggest Discount</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden relative">
              <SlidersHorizontal className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full" />
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-sm rounded">
              Search: "{filters.search}"
              <button onClick={() => updateFilter('search', '')} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.category !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-sm rounded">
              {filters.category}
              <button onClick={() => updateFilter('category', 'all')} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.brand !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-sm rounded">
              Brand: {filters.brand}
              <button onClick={() => updateFilter('brand', 'all')} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.minRating > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-sm rounded">
              {filters.minRating}+ ★
              <button onClick={() => updateFilter('minRating', 0)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.inStockOnly && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-sm rounded">
              In Stock
              <button onClick={() => updateFilter('inStockOnly', false)} className="hover:text-destructive">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
