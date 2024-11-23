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
      <div className='flex justify-center space-x-4'>
        <CustomLink path='/' text='Subscribe' />
      </div>
    );
  }

  if (pathname === '/privacy') {
    return (
      <div className='relative flex w-full items-center'>
        <div className='flex w-full justify-center'>
          <div className='inline-flex'>
            <CustomLink path='/' text='Subscribe' />
          </div>
        </div>
        <div className='absolute right-0'>
          <CustomLink
            path='/unsubscribe'
            text='Unsubscribe'
            className='rounded bg-gray-50 px-3 py-1.5 text-sm text-gray-500 transition-colors duration-200 hover:bg-gray-100'
          />
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
