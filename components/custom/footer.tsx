import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CustomLink } from './customLink';

const links = [{ name: 'Subscribe', path: '/' }];

function Footer() {
  const pathname = usePathname();

  return (
    <div>
      {pathname === '/' ? (
        <p className='text-center text-xs text-gray-600'>
          By subscribing, you agree to our{' '}
          <Link
            className='font-medium text-indigo-600 hover:text-indigo-500'
            href='/privacy'
          >
            Privacy Policy
          </Link>
          .
        </p>
      ) : (
        <ul className='flex justify-center space-x-4'>
          {links.map(
            link =>
              pathname !== link.path &&
              !(pathname === '/confirmation' && link.path === '/') && (
                <CustomLink key={link.path} path={link.path} text={link.name} />
              )
          )}
          {pathname === '/privacy' && (
            <CustomLink path='/unsubscribe' text='Unsubscribe' />
          )}
        </ul>
      )}
    </div>
  );
}

export default Footer;
