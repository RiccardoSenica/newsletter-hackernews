'use client';
import Link from 'next/link';
import { Button } from '../ui/button';

interface LinkProps {
  path: string;
  text: string;
}

export default function CustomLink({ path, text }: LinkProps) {
  return (
    <Button asChild>
      <Link href={path}>{text}</Link>
    </Button>
  );
}
