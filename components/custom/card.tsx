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
    console.log(isMobile);
    return (
      <CardUI className={`max-h-[90vh] w-[90%] p-4`}>
        <CardHeader className='text-center'>
          <p className='text-xs uppercase'>{overtitle}</p>
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
    );
  }

  return (
    <div className='gradient-border'>
      <CardUI
        style={{
          boxShadow: '0 16px 32px 0 rgba(0, 0, 0, 0.6)'
        }}
        className={`${style ?? 'sm:w-2/3 md:w-2/5 lg:w-1/3 xl:w-1/4'} p-4`}
      >
        <CardHeader className='w-80 text-center'>
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
