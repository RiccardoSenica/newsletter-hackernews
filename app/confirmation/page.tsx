'use client';
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
      return message;
    }

    return 'Just a second...';
  }

  return (
    <CustomCard
      style='text-center w-96 max-90vw'
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
