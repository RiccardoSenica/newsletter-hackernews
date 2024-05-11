'use client';
import Card from '@components/custom/Card';
import ErrorMessage from '@components/custom/Error';
import { Button } from '@components/ui/Button';
import { FormControl } from '@components/ui/form/FormControl';
import { FormMessage } from '@components/ui/form/FormMessage';
import { Input } from '@components/ui/Input';
import { FormField } from '@contexts/FormField/FormFieldProvider';
import { FormItem } from '@contexts/FormItem/FormItemProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ResponseType,
  UnsubscribeFormSchema,
  UnsubscribeFormType
} from '@utils/validationSchemas';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export default function Unsubscribe() {
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);

  const form = useForm<UnsubscribeFormType>({
    resolver: zodResolver(UnsubscribeFormSchema),
    defaultValues: {
      email: ''
    }
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = 'none';
    }
  }, []);

  async function handleSubmit(values: UnsubscribeFormType) {
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: values.email
        })
      });

      if (!response?.ok) {
        throw new Error(`Invalid response: ${response.status}`);
      }

      const formResponse: ResponseType = await response.json();

      if (!formResponse.success) {
        throw Error(formResponse.message);
      }

      setMessage(formResponse.message);
      setCompleted(true);
    } catch (error) {
      setError(true);
    }
  }

  function render() {
    if (error) {
      return ErrorMessage();
    }

    if (completed) {
      return message;
    }

    return (
      <div className='mb-5 h-32'>
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex flex-col space-y-4'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <div className='h-4'>
                    <FormMessage className='text-center' />
                  </div>
                  <FormControl>
                    <Input placeholder='example@example.com' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='align-top'>
              <Button type='submit'>Submit</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  }

  return (
    <Card
      style='text-center max-w-80'
      title='Unsubscribe'
      description='You sure you want to leave? :('
      content={render()}
    />
  );
}
