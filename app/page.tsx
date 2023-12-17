'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomCard } from '../components/custom/card';
import ErrorMessage from '../components/custom/error';
import { Button } from '../components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { ResponseSchema, SubscribeFormSchema } from '../utils/schemas';

export default function Home() {
  const [completed, setCompleted] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);
  const honeypotRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<z.infer<typeof SubscribeFormSchema>>({
    resolver: zodResolver(SubscribeFormSchema),
    defaultValues: {
      email: '',
      name: ''
    }
  });

  useEffect(() => {
    if (honeypotRef.current) {
      honeypotRef.current.style.display = 'none';
    }
  }, []);

  async function handleSubmit(values: z.infer<typeof SubscribeFormSchema>) {
    if (values.name) {
      return;
    }

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: values.email
        })
      });

      if (!response?.ok) {
        throw new Error(`Invalid response: ${response.status}`);
      }

      const formResponse: z.infer<typeof ResponseSchema> =
        await response.json();

      if (!formResponse.success) {
        throw Error(formResponse.message);
      }

      setMessage(formResponse.message);
      setCompleted(true);
    } catch (error) {
      setError(true);
    }
  }

  function render() {
    if (error) {
      return ErrorMessage();
    }

    if (completed) {
      return message;
    }

    return (
      <div className='h-12 align-top'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='flex space-x-4'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder='example@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='align-top'>
              <Button type='submit'>Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <CustomCard
      style='text-center'
      title='Hackernews + newsletter'
      description='Top stories from Hackernews. Once a day. Every day.'
      content={render()}
    />
  );
}
