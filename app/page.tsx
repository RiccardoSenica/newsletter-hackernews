'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Card from '../components/custom/Card';
import ErrorMessage from '../components/custom/Error';
import { Button } from '../components/ui/Button';
import { FormControl } from '../components/ui/form/FormControl';
import { FormMessage } from '../components/ui/form/FormMessage';
import { Input } from '../components/ui/Input';
import { FormField } from '../contexts/FormField/FormFieldProvider';
import { FormItem } from '../contexts/FormItem/FormItemProvider';
import {
  ResponseType,
  SubscribeFormSchema,
  SubscribeFormType
} from '../utils/validationSchemas';

export default function Home() {
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);

  const form = useForm<SubscribeFormType>({
    resolver: zodResolver(SubscribeFormSchema),
    defaultValues: {
      email: ''
    }
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = 'none';
    }
  }, []);

  async function handleSubmit(values: SubscribeFormType) {
    try {
      const response = await fetch('/api/subscribe', {
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
      <div className='mx-2 h-44'>
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
                    <Input
                      placeholder='example@example.com'
                      className='text-center'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='align-top'>
              <Button type='submit'>Submit</Button>
            </div>
          </form>
        </FormProvider>
        <p className='py-1 text-center text-xs text-gray-600'>
          You can rest assured that we will fill your inbox with spam. We
          don&apos;t like it either! 🙂
        </p>
      </div>
    );
  }

  return (
    <Card
      style='text-center max-w-96'
      title='Interested in keeping up with the latest from the tech world? 👩‍💻'
      description='Subscribe to our newsletter! The top stories from Hackernews for you. Once a day. Every day.'
      content={render()}
    />
  );
}
