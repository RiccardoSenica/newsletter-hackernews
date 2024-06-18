import { useFormField } from '@hooks/useFormField';
import { cn } from '@utils/cn';
import * as React from 'react';

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();
  const body = error ? String(error?.message) : children;

  return (
    <>
      {!body ? null : (
        <p
          ref={ref}
          id={formMessageId}
          className={cn('text-sm font-medium text-destructive', className)}
          {...props}
        >
          {body}
        </p>
      )}
    </>
  );
});

FormMessage.displayName = 'FormMessage';
