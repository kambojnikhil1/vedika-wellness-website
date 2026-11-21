import { useState } from 'react';
import { Utensils } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  eager?: boolean;
}

export function SmartImage({ src, alt, className = '', eager = false }: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-emerald-50 to-stone-100 dark:from-emerald-950/50 dark:to-stone-900 text-emerald-800 dark:text-emerald-300 p-6 text-center ${className}`}
      >
        <Utensils className="w-7 h-7 opacity-70" aria-hidden="true" />
        <span className="text-xs font-medium opacity-80 max-w-[20ch]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
