import React from 'react';
import { cn } from '@/lib/utils';

interface NeomorphismProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export const Neomorphism: React.FC<NeomorphismProps> = ({
  children,
  className,
  interactive = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        'neomorphism',
        interactive && 'hover:shadow-[12px_12px_24px_#040404,-12px_-12px_24px_#121212]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
