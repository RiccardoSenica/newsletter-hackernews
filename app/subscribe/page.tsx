'use client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { z } from 'zod';
import { Button } from '../../components/Button';
import { VerticalLayout } from '../../components/VerticalLayout';
import { ResponseSchema } from './../utils/types';

export default function Home() {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: data.get('email'),
          targetingAllowed: isChecked
        })
      });

      if (!response?.ok) {
        throw new Error(`Invalid response: ${response.status}`);
      }

      const formResponse: z.infer<typeof ResponseSchema> =
        await response.json();

      console.log(formResponse);

      router.push('/success');
    } catch (err) {
      console.log(err);
      alert('Error');
    }
  }

  function handleCheckboxChange() {
    setIsChecked(!isChecked);
  }

  return (
    <VerticalLayout>
      <form className='container' onSubmit={handleSubmit}>
        <h1>Subscribe to newsletter</h1>
        <div className='email block'>
          <label htmlFor='frm-email'>Email</label>
          <input
            placeholder='example@email.com'
            id='email'
            type='email'
            name='email'
            required
          />
        </div>
        <div className='checkbox block'>
          <label htmlFor='frm-checkbox'>Allow advertising</label>
          <input
            id='targetingAllowed'
            type='checkbox'
            name='targetingAllowed'
            checked={isChecked}
            onChange={handleCheckboxChange}
          />
        </div>
        <div className='button block'>
          <button type='submit'>Subscribe</button>
        </div>
      </form>
      <Button label='Home' onClick={() => router.push('/')} />
      <Button label='Unsubscribe' onClick={() => router.push('/unsubscribe')} />
    </VerticalLayout>
  );
}
