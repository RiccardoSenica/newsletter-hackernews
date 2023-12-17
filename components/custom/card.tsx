import { ReactNode } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../../components/ui/card';
import Footer from './footer';

type CustomCardProps = {
  title: string;
  description?: string;
  content: ReactNode;
  style?: string;
  footer?: boolean;
};

export const CustomCard = ({
  title,
  description,
  content,
  style,
  footer = true
}: CustomCardProps) => {
  return (
    <Card
      className={`${style ?? 'w-full sm:w-2/3 md:w-2/5 lg:w-1/3 xl:w-1/4'} p-4`}
    >
      <CardHeader className='text-center'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className='h-[80%] overflow-auto'>{content}</CardContent>
      {footer && (
        <CardFooter className=' flex justify-center p-4'>
          <Footer />
        </CardFooter>
      )}
    </Card>
  );
};
