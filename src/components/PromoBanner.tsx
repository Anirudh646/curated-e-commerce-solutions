import { X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-accent text-accent-foreground">
      <div className="container flex items-center justify-between py-2.5 text-sm">
        <div className="flex-1" />
        <p className="text-center font-medium">
          🎉 New Year Sale: Up to 40% off on selected items. Use code <span className="font-bold">LUXE2025</span>
        </p>
        <div className="flex-1 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-accent-foreground/10"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
