import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComparisonStore } from '@/stores/comparisonStore';

export function CompareFloatingBar() {
  const { products, setIsOpen } = useComparisonStore();

  if (products.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
      <Button
        onClick={() => setIsOpen(true)}
        className="gap-2 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90"
      >
        <Scale className="h-4 w-4" />
        Compare ({products.length})
      </Button>
    </div>
  );
}
