import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallback = '/images/placeholder.png',
  className,
}) => {
  // Initialize with src directly to avoid setState in effect
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [prevSrc, setPrevSrc] = useState(src);

  // Update imgSrc when src prop changes
  if (src !== prevSrc) {
    setImgSrc(src);
    setIsLoading(true);
    setPrevSrc(src);
  }

  const handleError = () => {
    setImgSrc(fallback);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      {isLoading && <Skeleton className={cn('absolute inset-0', className)} />}
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(className, { 'opacity-0': isLoading })}
        loading="lazy"
      />
    </div>
  );
};
