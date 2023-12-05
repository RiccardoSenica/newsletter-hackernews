import { usePathname } from 'next/navigation';
import { Link } from './link';

const links = [
  { name: 'Subscribe', path: '/' },
  { name: 'Privacy Policy', path: '/privacy' },
];

function Footer() {
  const pathname = usePathname();

  return (
    <ul className="flex justify-center space-x-4">
      {links.map(
        (link) =>
          pathname !== link.path &&
          !(pathname === '/confirmation' && link.path === '/subscribe') && (
            <Link key={link.path} path={link.path} text={link.name} />
          )
      )}
      {pathname === '/privacy' && (
        <Link path="/unsubscribe" text="Unsubscribe" />
      )}
    </ul>
  );
}

export default Footer;
