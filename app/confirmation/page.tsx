'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { CustomCard } from '../../components/custom/card';
import { ResponseSchema } from '../../utils/schemas';

export default function Confirmation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) {
      router.push('/');
    }

    fetch('/api/confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: code
      })
    })
      .then(async res => {
        if (!res.ok) {
          router.push('/');
        }

        const response: z.infer<typeof ResponseSchema> = await res.json();

        if (!response.success) {
          router.push('/');
        }

        return response;
      })
      .then(response => {
        setMessage(response.message);
        setLoading(false);
      });
  }, [code, router]);

  function render() {
    if (!loading) {
      return message;
    }

    return 'Just a second...';
  }

  return (
    <CustomCard
      style='text-center'
      title={loading ? 'Verifying' : 'Confirmed!'}
      content={render()}
      footer={false}
    />
  );
}
