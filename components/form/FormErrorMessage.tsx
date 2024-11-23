import { useFormField } from '@hooks/useFormField';
import { XCircle } from 'lucide-react';
import * as React from 'react';

export const FormErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(() => {
  const { error, formMessageId } = useFormField();
  const body = error?.message;

  return (
    body && (
      <div
        id={formMessageId}
        className='flex items-center justify-center gap-2 text-sm text-red-500 duration-200 animate-in fade-in slide-in-from-top-1'
      >
        <XCircle className='h-4 w-4' />
        <span>{body}</span>
      </div>
    )
  );
});

FormErrorMessage.displayName = 'FormErrorMessage';
