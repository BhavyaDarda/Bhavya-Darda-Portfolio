import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface GlassmorphismProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export const Glassmorphism = forwardRef<HTMLDivElement, GlassmorphismProps>(({
  children,
  className,
  interactive = true,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'glassmorphism',
        interactive && 'hover:bg-white/10',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
