import { Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useComparisonStore, ComparisonProduct } from '@/stores/comparisonStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CompareButtonProps {
  product: ComparisonProduct;
  className?: string;
  variant?: 'icon' | 'full';
}

export function CompareButton({ product, className, variant = 'icon' }: CompareButtonProps) {
  const { addProduct, removeProduct, isInComparison, setIsOpen, products } = useComparisonStore();
  const isComparing = isInComparison(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isComparing) {
      removeProduct(product.id);
      toast.success('Removed from comparison');
    } else {
      const added = addProduct(product);
      if (added) {
        toast.success('Added to comparison', {
          action: {
            label: 'Compare Now',
            onClick: () => setIsOpen(true),
          },
        });
      } else {
        toast.error('Maximum 4 products can be compared');
      }
    }
  };

  if (variant === 'full') {
    return (
      <Button
        variant={isComparing ? 'secondary' : 'outline'}
        onClick={handleClick}
        className={cn('gap-2', className)}
      >
        <Scale className="h-4 w-4" />
        {isComparing ? 'Remove from Compare' : 'Add to Compare'}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn(
        'h-8 w-8 rounded-full',
        isComparing && 'bg-primary text-primary-foreground',
        className
      )}
    >
      <Scale className="h-4 w-4" />
    </Button>
  );
}
