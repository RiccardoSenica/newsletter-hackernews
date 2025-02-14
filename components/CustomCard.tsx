import { ReactNode, useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from './Card';
import { Footer } from './Footer';

interface CardProps {
  title: string;
  description?: string;
  content: ReactNode;
  className?: string;
  footer?: boolean;
}

export const CustomCard = ({
  title,
  description,
  content,
  className = '',
  footer = true
}: CardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return null;
  }

  return (
    <div className='mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8'>
      <div className='gradient-border shadow-2xl shadow-black'>
        <Card
          className={`z-10 w-full transform p-8 transition-all duration-300 ${className}`}
        >
          <CardHeader>
            <p className='text-xs uppercase text-gray-500'>
              Hacker News + newsletter
            </p>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>{content}</CardContent>
          {footer && (
            <CardFooter>
              <Footer />
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};
