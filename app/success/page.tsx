'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/Button';
import { VerticalLayout } from '../../components/VerticalLayout';

export default function Home() {
  const router = useRouter();

  return (
    <VerticalLayout>
      <h1>Success!</h1>
      <Button label='Home' onClick={() => router.push('/')} />
    </VerticalLayout>
  );
}
