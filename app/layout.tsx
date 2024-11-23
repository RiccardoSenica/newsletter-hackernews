import { Tiles } from '@components/tiles/Tiles';
import { cn } from '@utils/cn';
import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';

export const metadata: Metadata = {
  title: `Hackernews newsletter by ${process.env.NEXT_PUBLIC_BRAND_NAME}`,
  description:
    'Newsletter delivering the best posts from the Hacker News forum',
  keywords: 'newsletter, hackernews, technology, coding, programming, news'
};

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <head />
      <body
        className={cn(
          'flex justify-center bg-background font-sans antialiased',
          fontSans.variable
        )}
      >
        <Tiles>
          <div className='z-10'>{children}</div>
        </Tiles>
        <Analytics />
      </body>
    </html>
  );
}
