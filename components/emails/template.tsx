import { Html } from '@react-email/html';
import { Section } from '@react-email/section';
import { getRandomColor } from '../../utils/getRandomColor';
import { Footer } from './components/footer';

type EmailProps = {
  title: string;
  body: JSX.Element;
};

export default function Email({ title, body }: EmailProps) {
  const titleBackground = getRandomColor();

  return (
    <Html>
      <Section className='max-w-2xl overflow-hidden rounded-lg bg-white shadow-lg'>
        <h1
          className='p-8 text-center text-3xl font-bold text-black'
          style={{ backgroundColor: `${titleBackground}` }}
        >
          {title}
        </h1>
        <div className='m-8 p-8'>{body}</div>
        <Footer />
      </Section>
    </Html>
  );
}
