'use client';
import Link from 'next/link';
import { Button } from './Button';

interface LinkProps {
  path: string;
  text: string;
  className?: string;
}

export default function CustomLink({ path, text, className }: LinkProps) {
  return (
    <Button asChild className={className}>
      <Link href={path}>{text}</Link>
    </Button>
  );
}
