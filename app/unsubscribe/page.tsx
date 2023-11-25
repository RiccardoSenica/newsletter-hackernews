'use client';
import { useRouter } from 'next/navigation';
import React from 'react';
import { z } from 'zod';
import { Button } from '../../components/Button';
import { VerticalLayout } from '../../components/VerticalLayout';
import { ResponseSchema } from './../utils/types';

export default function Home() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.get('email'),
        }),
      });

      if (!response?.ok) {
        throw new Error(`Invalid response: ${response.status}`);
      }

      const formResponse: z.infer<typeof ResponseSchema> =
        await response.json();

      router.push('/success');
    } catch (err) {
      console.log(err);
      alert('Error');
    }
  }

  return (
    <VerticalLayout>
      <form className="container" onSubmit={handleSubmit}>
        <h1>Unsubscribe newsletter</h1>
        <div className="email block">
          <label htmlFor="frm-email">Email</label>
          <input
            placeholder="example@email.com"
            id="email"
            type="email"
            name="email"
            required
          />
        </div>
        <div className="button block">
          <button type="submit">Unsubscribe</button>
        </div>
      </form>
      <Button label="Home" onClick={() => router.push('/')} />
      <Button label="Subscribe" onClick={() => router.push('/subscribe')} />
    </VerticalLayout>
  );
}
