import { Link } from '../custom/link';
import { Note } from './components/note';
import Email from './template';

export default function UnsubscribeTemplate() {
  return {
    subject: 'Unsubscribe confirmation',
    template: (
      <Email
        title="We're sad you're leaving :("
        body={
          <div className='mt-8'>
            <p className='mt-2 text-base text-gray-700 dark:text-gray-400'>
              You have been successfully unsubscribed from our newsletter. You
              won&apos;t receive any further communications from us unless you
              explicitly opt-in again.
            </p>
            <div className='my-8 flex justify-center'>
              <Link path='/' text='Re-subscribe' />
            </div>
            <Note>
              If you have any questions or concerns, please feel free to{' '}
              <a className='text-blue-500 underline' href='#'>
                contact us
              </a>
              .
            </Note>
          </div>
        }
      />
    )
  };
}
