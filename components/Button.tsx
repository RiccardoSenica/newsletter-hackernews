import { Slot } from '@radix-ui/react-slot';
import { cn } from '@utils/ui';
import * as React from 'react';

export type ButtonProps = {
  asChild?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn('btn-grad', 'btn-grad-hover')} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button };
