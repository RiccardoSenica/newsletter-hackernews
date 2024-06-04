'use client';
import { CardDescription } from '@components/Card';
import CustomCard from '@components/CustomCard';
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

  function render() {
    if (!loading) {
      return (
        <CardDescription className='text-center'>{message}</CardDescription>
      );
    }

    return 'Just a second...';
  }

  return (
    <CustomCard
      className='max-90vw w-96'
      title={loading ? 'Verifying' : 'Confirmed!'}
      content={render()}
      footer={false}
    />
  );
}

export default function Confirmation() {
  return (
    <Suspense fallback={<>Loading...</>}>
      <ConfirmationPage />
    </Suspense>
  );
}
