import { ReactNode, useEffect, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Card as CardUI
} from '../../components/ui/card';
import Footer from './footer';

interface CardProps {
  title: string;
  description?: string;
  content: ReactNode;
  style?: string;
  footer?: boolean;
}

export default function Card({
  title,
  description,
  content,
  style,
  footer = true
}: CardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className='gradient-border'>
      <CardUI
        style={{
          boxShadow: '0 16px 32px 0 rgba(0, 0, 0, 0.6)'
        }}
        className={`max-h-[90vh] max-w-[90vw] p-8 ${style}`}
      >
        <CardHeader>
          <p className='text-xs uppercase text-gray-500'>
            Hackernews + newsletter
          </p>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {isMobile ? (
          <CardContent>{content}</CardContent>
        ) : (
          <CardContent className='flex max-h-[60vh] flex-grow  justify-center overflow-auto'>
            {content}
          </CardContent>
        )}
        {footer && (
          <CardFooter>
            <Footer />
          </CardFooter>
        )}
      </CardUI>
    </div>
  );
}
