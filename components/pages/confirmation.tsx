'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { ResponseSchema } from '../../utils/types';
import { HomeLink } from '../elements/homeLink';

export const ConfirmationPage = () => {
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
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: code,
      }),
    })
      .then(async (res) => {
        if (!res.ok) {
          router.push('/');
        }
        const response: z.infer<typeof ResponseSchema> = await res.json();
        return response;
      })
      .then((response) => {
        setMessage(response.message);
        setLoading(false);
      });
  }, [code, router]);

  if (!loading) {
    return (
      <div>
        <h1>{message}</h1>
        <HomeLink />
      </div>
    );
  }

  return (
    <div>
      <h1>Verifying...</h1>
      <HomeLink />
    </div>
  );
};
