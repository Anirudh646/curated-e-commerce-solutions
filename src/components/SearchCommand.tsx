import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Clock, TrendingUp, Loader2, X } from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { supabase } from '@/integrations/supabase/client';
import { productImage } from '@/lib/images';

interface SearchProduct {
  id: string;
  name: string;
  price: number;
  category: string;
  image_url: string | null;
}

const RECENTS_KEY = 'luxestore-recent-searches';
const TRENDING = ['Saree', 'Headphones', 'Yoga Mat', 'Smart Watch', 'Kurta', 'Coffee'];

function loadRecents(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
  } catch {
    return [];
  }
}

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [recents, setRecents] = useState<string[]>([]);
  const reqId = useRef(0);

  useEffect(() => {
    if (open) setRecents(loadRecents());
  }, [open]);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const id = ++reqId.current;
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, category, image_url')
        .eq('is_active', true)
        .ilike('name', `%${term}%`)
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(8);
      if (id !== reqId.current) return;
      setResults(data || []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const rememberTerm = (term: string) => {
    const next = [term, ...loadRecents().filter((t) => t !== term)].slice(0, 6);
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next));
    setRecents(next);
  };

  const openProduct = (product: SearchProduct) => {
    rememberTerm(product.name);
    onOpenChange(false);
    setQuery('');
    navigate(`/local-product/${product.id}`);
  };

  const runTerm = (term: string) => {
    setQuery(term);
  };

  const clearRecents = () => {
    localStorage.removeItem(RECENTS_KEY);
    setRecents([]);
  };

  const showSuggestions = useMemo(() => query.trim().length < 2, [query]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search the whole catalogue..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList className="max-h-[420px]">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Searching...
          </div>
        )}

        {!loading && !showSuggestions && results.length === 0 && (
          <CommandEmpty>No products match “{query}”.</CommandEmpty>
        )}

        {showSuggestions && recents.length > 0 && (
          <CommandGroup
            heading={
              <span className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Recent
                </span>
                <button
                  onClick={clearRecents}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3" /> Clear
                </button>
              </span>
            }
          >
            {recents.map((term) => (
              <CommandItem key={term} value={term} onSelect={() => runTerm(term)}>
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                {term}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {showSuggestions && (
          <CommandGroup
            heading={
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Trending searches
              </span>
            }
          >
            {TRENDING.map((term) => (
              <CommandItem key={term} value={term} onSelect={() => runTerm(term)}>
                <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                {term}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {!loading && results.length > 0 && (
          <CommandGroup heading="Products">
            {results.map((product) => (
              <CommandItem
                key={product.id}
                value={`${product.name}-${product.id}`}
                onSelect={() => openProduct(product)}
                className="gap-3"
              >
                <img
                  src={productImage(product.image_url, product.category)}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = productImage(null, product.category);
                  }}
                  alt={product.name}
                  loading="lazy"
                  className="h-10 w-10 rounded-md object-cover"
                />
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate text-sm font-medium">{product.name}</span>
                  <span className="text-xs text-muted-foreground">{product.category}</span>
                </span>
                <span className="text-sm font-semibold">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
