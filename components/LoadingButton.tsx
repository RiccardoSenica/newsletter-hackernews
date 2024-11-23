import React from 'react';
import { Button, ButtonProps } from './Button';
import { Loader2 } from 'lucide-react';
import { cn } from '@utils/cn';

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading, children, disabled, ...props }, ref) => {
    return (
      <Button {...props} disabled={disabled || loading} ref={ref}>
        <div className='relative'>
          <span
            className={cn(
              'flex items-center justify-center',
              loading ? 'invisible' : 'visible'
            )}
          >
            {children}
          </span>

          {loading && (
            <span className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Loading
            </span>
          )}
        </div>
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export { LoadingButton };
