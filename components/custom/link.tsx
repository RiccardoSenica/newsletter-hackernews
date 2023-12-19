import { Button } from '../ui/button';

type LinkProps = {
  path: string;
  text: string;
};

export function Link({ path, text }: LinkProps) {
  return (
    <Button asChild>
      <a href={path}>{text}</a>
    </Button>
  );
}
