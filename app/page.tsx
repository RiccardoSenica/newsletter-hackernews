'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../components/Button';
import { VerticalLayout } from '../components/VerticalLayout';

export default function Home() {
  const router = useRouter();

  return (
    <VerticalLayout>
      <h1>Home</h1>
      <Button label='Subscribe' onClick={() => router.push('/subscribe')} />
      <Button label='Unsubscribe' onClick={() => router.push('/unsubscribe')} />
    </VerticalLayout>
  );
}
