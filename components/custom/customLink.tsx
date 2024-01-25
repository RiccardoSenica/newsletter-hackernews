import Link from 'next/link';
import { Button } from '../ui/button';

type LinkProps = {
  path: string;
  text: string;
};

export function CustomLink({ path, text }: LinkProps) {
  return (
    <Button asChild>
      <Link href={path}>{text}</Link>
    </Button>
  );
}
