'use client';

import { CardDescription } from '@components/Card';
import { CustomCard } from '@components/CustomCard';
import { ErrorMessage } from '@components/ErrorMessage';
import { FormControl } from '@components/form/FormControl';
import { FormErrorMessage } from '@components/form/FormErrorMessage';
import { Input } from '@components/Input';
import { SchemaOrg } from '@components/SchemaOrg';
import { FormField } from '@contexts/FormField/FormFieldProvider';
import { FormItem } from '@contexts/FormItem/FormItemProvider';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoadingButton } from '@components/LoadingButton';
import {
  ResponseType,
  SubscribeFormSchema,
  SubscribeFormType
} from '@utils/validationSchemas';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export const Home = () => {
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HackerNews Newsletter',
    title: 'Home',
    url: process.env.HOME_URL
  };

  const form = useForm<SubscribeFormType>({
    resolver: zodResolver(SubscribeFormSchema),
    defaultValues: {
      email: ''
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit'
  });

  async function handleSubmit(values: SubscribeFormType) {
    setIsLoading(true);
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
                  <div className='h-6'>
                    <FormErrorMessage className='text-center' />
                  </div>
                  <FormControl>
                    <Input
                      placeholder='example@example.com'
                      className='text-center'
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='align-top'>
              <LoadingButton type='submit' loading={isLoading}>
                Submit
              </LoadingButton>
            </div>
          </form>
        </FormProvider>
        <p className='py-1 text-center text-xs text-gray-600'>
          You can rest assured that we will not fill your inbox with spam. We
          don&apos;t like it either! 🙂
        </p>
      </div>
    );
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <CustomCard
        className='max-90vw w-96'
        title='Interested in keeping up with the latest from the tech world? 👩‍💻'
        description='Subscribe to our newsletter! Top stories from Hackernews for you. Once a day. Every day.'
        content={renderContent()}
      />
    </>
  );
};

export default Home;
