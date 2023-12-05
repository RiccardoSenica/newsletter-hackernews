import NextLink from 'next/link';
import { Button } from '../ui/button';

type LinkProps = {
  path: string;
  text: string;
};

export function Link({ path, text }: LinkProps) {
  return (
    <Button asChild>
      <NextLink href={path}>{text}</NextLink>
    </Button>
  );
}
