import Link from 'next/link';

type CustomLinkProps = {
  path: string;
  text: string;
};

export function CustomLink({ path, text }: CustomLinkProps) {
  return (
    <Link href={path} className="overflow-hidden rounded-md">
      <h1>{text}</h1>
    </Link>
  );
}
