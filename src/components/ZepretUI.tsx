import React from 'react';
import { cn } from '@/lib/utils';

export const ZepretButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'glass' | 'outline' }
>(({ className, variant = 'primary', ...props }, ref) => {
  const variants = {
    primary: 'bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed shadow-[0_10px_20px_rgba(255,90,143,0.3)] hover:scale-105',
    secondary: 'bg-gradient-to-br from-secondary to-secondary-container text-white shadow-[0_10px_20px_rgba(82,3,213,0.3)] hover:scale-105',
    glass: 'glass-panel text-white hover:bg-white/10',
    outline: 'border border-white/10 text-white hover:bg-white/5',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'px-8 py-3 rounded-xl font-headline font-bold transition-all duration-300 flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
ZepretButton.displayName = 'ZepretButton';

export const ZepretCard = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'glass-panel p-8 rounded-lg shadow-2xl transition-all duration-500',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ZepretBadge = ({ className, children, color = 'primary' }: { className?: string, children: React.ReactNode, color?: 'primary' | 'secondary' | 'tertiary' }) => {
  const colors = {
    primary: 'text-primary border-primary/20',
    secondary: 'text-secondary border-secondary/20',
    tertiary: 'text-tertiary border-tertiary/20',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border font-label text-sm font-semibold tracking-wider uppercase',
      colors[color],
      className
    )}>
      {children}
    </span>
  );
};
