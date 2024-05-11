'use client';
import { Button } from '@components/Button';
import CustomCard from '@components/CustomCard';
import ErrorMessage from '@components/ErrorMessage';
import { FormControl } from '@components/form/FormControl';
import { FormMessage } from '@components/form/FormMessage';
import { Input } from '@components/Input';
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
                  <div className='h-6'>
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
    <CustomCard
      style='text-center w-96 max-90vw'
      title='Unsubscribe'
      description='You sure you want to leave? :('
      content={render()}
    />
  );
}
