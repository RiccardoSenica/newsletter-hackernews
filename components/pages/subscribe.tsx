'use client';
import React, { useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { ResponseSchema } from '../../utils/types';
import { CustomLink } from '../elements/customLink';
import ErrorComponent from '../elements/error';
import { HomeLink } from '../elements/homeLink';
import { SuccessComponent } from '../elements/success';

export const SubscribeForm = () => {
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const honeypotRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (honeypotRef.current) {
      honeypotRef.current.style.display = 'none';
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    if (data.get('name')) {
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
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

      setMessage(formResponse.message);
      setCompleted(true);
    } catch (error) {
      console.log('Subscribe error', error);
      setError(true);
    }
  }

  if (error) {
    return ErrorComponent();
  }

  if (completed) {
    return SuccessComponent(message);
  }

  return (
    <div>
      <form className="container" onSubmit={handleSubmit}>
        <h1>Subscribe to newsletter</h1>
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
        <input type="text" name="name" ref={honeypotRef} />
        <div className="button block">
          <button type="submit">Subscribe</button>
        </div>
      </form>
      <HomeLink />
      <CustomLink path={`/unsubscribe`} text="Unsubscribe" />
    </div>
  );
};
