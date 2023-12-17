import { usePathname } from 'next/navigation';
import { Link } from './link';

const links = [{ name: 'Subscribe', path: '/' }];

function Footer() {
  const pathname = usePathname();

  return (
    <div>
      {pathname === '/' ? (
        <p className='text-center text-xs text-gray-600'>
          By subscribing, you agree to our{' '}
          <a
            className='font-medium text-indigo-600 hover:text-indigo-500'
            href='/privacy'
          >
            Privacy Policy
          </a>
          .
        </p>
      ) : (
        <ul className='flex justify-center space-x-4'>
          {links.map(
            link =>
              pathname !== link.path &&
              !(pathname === '/confirmation' && link.path === '/') && (
                <Link key={link.path} path={link.path} text={link.name} />
              )
          )}
          {pathname === '/privacy' && (
            <Link path='/unsubscribe' text='Unsubscribe' />
          )}
        </ul>
      )}
    </div>
  );
}

export default Footer;
