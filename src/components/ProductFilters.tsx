import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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

export interface FilterState {
  search: string;
  category: string;
  priceRange: [number, number];
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  categories: string[];
  maxPrice: number;
}

export function ProductFilters({ filters, onFiltersChange, categories, maxPrice }: ProductFiltersProps) {
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
    });
  };

  const hasActiveFilters = 
    filters.search !== '' ||
    filters.category !== 'all' ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < maxPrice ||
    filters.sortBy !== 'newest';

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

      {/* Price Range */}
      <div className="space-y-3">
        <Label>Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}</Label>
        <Slider
          value={filters.priceRange}
          onValueChange={(v) => updateFilter('priceRange', v as [number, number])}
          min={0}
          max={maxPrice}
          step={100}
          className="mt-2"
        />
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
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button variant="outline" onClick={clearFilters} className="w-full">
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="mb-8 space-y-4">
      {/* Search and Mobile Filter Toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
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
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filter Sheet */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <SlidersHorizontal className="h-4 w-4" />
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
        </div>
      )}
    </div>
  );
}
