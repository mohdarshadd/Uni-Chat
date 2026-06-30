import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label ? (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full rounded-lg border border-surface-300 bg-white px-4 py-2.5 text-sm text-surface-900 transition-colors placeholder:text-surface-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-surface-700 dark:bg-surface-800 dark:text-surface-100 dark:placeholder:text-surface-500 dark:focus:border-brand-500',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-red-500">{error}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = 'Input';
