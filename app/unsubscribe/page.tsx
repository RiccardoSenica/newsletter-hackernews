'use client';

import { CardDescription } from '@components/Card';
import { CustomCard } from '@components/CustomCard';
import { ErrorMessage } from '@components/ErrorMessage';
import { FormControl } from '@components/form/FormControl';
import { FormErrorMessage } from '@components/form/FormErrorMessage';
import { Input } from '@components/Input';
import { LoadingButton } from '@components/LoadingButton';
import { SchemaOrg } from '@components/SchemaOrg';
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

const Unsubscribe = () => {
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HackerNews Newsletter',
    title: 'Unsubscribe',
    url: `${process.env.HOME_URL}/unsubscribe`
  };

  const form = useForm<UnsubscribeFormType>({
    resolver: zodResolver(UnsubscribeFormSchema),
    defaultValues: {
      email: ''
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.style.display = 'none';
    }
  }, []);

  async function handleSubmit(values: UnsubscribeFormType) {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  }

  const renderContent = () => {
    if (error) {
      return ErrorMessage();
    }

    if (completed) {
      return (
        <CardDescription className='text-center'>{message}</CardDescription>
      );
    }

    return (
      <div className='flex h-32 flex-col justify-between'>
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
                    <FormErrorMessage className='text-center' />
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
            <div className='mt-2 flex justify-center'>
              <LoadingButton
                type='submit'
                loading={isLoading}
                className='rounded bg-gray-50 px-3 py-1.5 text-sm text-gray-500 transition-colors duration-200 hover:bg-gray-100'
              >
                Unsubscribe
              </LoadingButton>
            </div>
          </form>
        </FormProvider>
      </div>
    );
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <CustomCard
        className='w-96'
        title='Stay in the Loop!'
        description="Don't miss out on the latest tech insights and community discussions."
        content={renderContent()}
        footer={true}
      />
    </>
  );
};

export default Unsubscribe;
