'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import CustomLink from './CustomLink';

export const Footer = () => {
  const pathname = usePathname();

  if (pathname === '/confirmation') {
    return;
  }

  if (pathname === '/unsubscribe') {
    return (
      <div className='flex flex-col justify-center space-x-4'>
        <CustomLink path='/' text='Subscribe' />
        <div className='mt-2 text-xs text-gray-600'>
          <Link
            className='font-medium text-indigo-600 hover:text-indigo-500'
            href='/privacy'
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    );
  }

  if (pathname === '/privacy') {
    return (
      <div className='w-full'>
        <div className='relative flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0'>
          <div>
            <CustomLink path='/' text='Subscribe' />
          </div>
          <div>
            <CustomLink
              path='/unsubscribe'
              text='Unsubscribe'
              className='rounded bg-gray-50 px-3 py-1.5 text-sm text-gray-500 transition-colors duration-200 hover:bg-gray-100'
            />
          </div>
        </div>
      </div>
    );
  }

  return (
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
  );
};
