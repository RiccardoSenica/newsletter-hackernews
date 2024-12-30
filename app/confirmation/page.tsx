'use client';

import { CardDescription } from '@components/Card';
import { CustomCard } from '@components/CustomCard';
import { SchemaOrg } from '@components/SchemaOrg';
import { ResponseType } from '@utils/validationSchemas';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

const ConfirmationPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const code = searchParams.get('code');

  useEffect(() => {
    const fetchData = async () => {
      if (!code) {
        router.push('/');
        return;
      }

      try {
        const { data } = await axios.post<ResponseType>(
          '/api/confirmation',
          {
            code: code
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (!data.success) {
          router.push('/');
          return;
        }

        setMessage(data.message);
        setLoading(false);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.response?.data || error.message);
        } else {
          console.error('Error:', error);
        }
        router.push('/');
      }
    };

    fetchData();
  }, [code, router]);

  const renderContent = () => {
    if (!loading) {
      return (
        <CardDescription className='text-center'>{message}</CardDescription>
      );
    }

    return (
      <CardDescription className='text-center'>
        Just a second...
      </CardDescription>
    );
  };

  return (
    <CustomCard
      className='max-90vw w-96'
      title={loading ? 'Verifying' : 'Confirmed!'}
      content={renderContent()}
      footer={false}
    />
  );
};

const Confirmation = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Hackernews Newsletter',
    title: 'Subscription Confirmation',
    url: `${process.env.HOME_URL}/confirmation`
  };

  return (
    <>
      <SchemaOrg schema={schema} />
      <Suspense fallback={<>Loading...</>}>
        <ConfirmationPage />
      </Suspense>
    </>
  );
};

export default Confirmation;
