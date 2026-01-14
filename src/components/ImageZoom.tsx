import { useState, useRef } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageZoom({ src, alt, className = '' }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setPosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover transition-transform duration-300 ${
          isZoomed ? 'scale-150' : 'scale-100'
        }`}
        style={
          isZoomed
            ? {
                transformOrigin: `${position.x}% ${position.y}%`,
              }
            : undefined
        }
      />
      {isZoomed && (
        <div className="absolute inset-0 pointer-events-none border-2 border-accent/20 rounded" />
      )}
    </div>
  );
}
