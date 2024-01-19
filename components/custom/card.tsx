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

type CardProps = {
  overtitle?: string;
  title: string;
  description?: string;
  content: ReactNode;
  style?: string;
  footer?: boolean;
};

export const Card = ({
  overtitle,
  title,
  description,
  content,
  style,
  footer = true
}: CardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  if (isMobile) {
    return (
      <div className='gradient-border'>
        <CardUI
          style={{
            boxShadow: '0 16px 32px 0 rgba(0, 0, 0, 0.6)'
          }}
          className={`max-h-[90vh] w-[90vw] p-4 text-center ${style}`}
        >
          <CardHeader className='text-center'>
            {overtitle && (
              <p className='text-xs uppercase text-gray-500'>{overtitle}</p>
            )}
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className='max-h-[60vh] overflow-auto'>
            {content}
          </CardContent>
          {footer && (
            <CardFooter className='flex justify-center p-4'>
              <Footer />
            </CardFooter>
          )}
        </CardUI>
      </div>
    );
  }

  return (
    <div className='gradient-border'>
      <CardUI
        style={{
          boxShadow: '0 16px 32px 0 rgba(0, 0, 0, 0.6)'
        }}
        className={`p-4 text-center ${style}`}
      >
        <CardHeader className='text-center'>
          {overtitle && (
            <p className='text-xs uppercase text-gray-500'>{overtitle}</p>
          )}
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className='flex h-[80%] flex-grow items-center justify-center overflow-auto'>
          {content}
        </CardContent>
        {footer && (
          <CardFooter className=' flex justify-center p-4'>
            <Footer />
          </CardFooter>
        )}
      </CardUI>
    </div>
  );
};
