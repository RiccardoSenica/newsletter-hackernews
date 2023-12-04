import { CustomLink } from '../components/elements/customLink';

export default function Home() {
  return (
    <div>
      <CustomLink path='/subscribe' text='Subscribe' />
      <CustomLink path='/unsubscribe' text='Unsubscribe' />
      <CustomLink path='/privacy' text='Privacy' />
    </div>
  );
}
