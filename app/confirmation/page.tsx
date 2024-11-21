'use client';

import { CardDescription } from '@components/Card';
import CustomCard from '@components/CustomCard';
import Schema from '@components/SchemaOrg';
import { ResponseType } from '@utils/validationSchemas';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ConfirmationPage() {
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
        const res = await fetch('/api/confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code: code
          })
        });

        if (!res.ok) {
          router.push('/');
          return;
        }

        const response: ResponseType = await res.json();

        if (!response.success) {
          router.push('/');
          return;
        }

        setMessage(response.message);
        setLoading(false);
      } catch (error) {
        console.error(error);
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
}

export default function Confirmation() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'HackerNews Newsletter',
    title: 'Subscription Confirmation',
    url: `${process.env.HOME_URL}/confirmation`
  };

  return (
    <>
      <Schema schema={schema} />
      <Suspense fallback={<>Loading...</>}>
        <ConfirmationPage />
      </Suspense>
    </>
  );
}
