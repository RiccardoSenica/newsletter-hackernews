'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import { z } from 'zod';
import Card from '../../components/custom/card';
import { ResponseSchema } from '../../utils/schemas';

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

        const response: z.infer<typeof ResponseSchema> = await res.json();

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
    <Card
      style='text-center'
      title={loading ? 'Verifying' : 'Confirmed!'}
      content={render()}
      footer={false}
    />
  );
}

export default function Confirmation() {
  return (
    <Suspense>
      <ConfirmationPage />
    </Suspense>
  );
}
