import React from 'react';
import { cn } from '@/lib/utils';

export const ZepretButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' }
>(({ className, variant = 'primary', ...props }, ref) => {
  const variants = {
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-black',
    outline: 'bg-white text-black',
  };

  return (
    <button
      ref={ref}
      className={cn(
        'neobrutal-shadow border-3 border-black font-headline uppercase font-black px-6 py-3 transition-all',
        'hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none active:translate-x-[4px] active:translate-y-[4px]',
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
        'neobrutal-shadow border-3 border-black bg-white p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const ZepretBadge = ({ className, children, color = 'primary' }: { className?: string, children: React.ReactNode, color?: 'primary' | 'secondary' }) => {
  return (
    <span className={cn(
      'border-2 border-black px-3 py-1 font-headline font-bold text-xs uppercase neobrutal-shadow',
      color === 'primary' ? 'bg-primary text-white' : 'bg-secondary text-black',
      className
    )}>
      {children}
    </span>
  );
};
