import { Link } from '../custom/link';
import { Note } from './components/note';
import Email from './template';

export default function ConfirmationTemplate(code: string) {
  return {
    subject: 'Welcome!',
    template: (
      <Email
        title={'Welcome!'}
        body={
          <div className='mt-8'>
            <p className='text-base text-gray-700 dark:text-gray-400'>
              Dear subscriber,
            </p>
            <p className='mt-2 text-base text-gray-700 dark:text-gray-400'>
              thank you for subscribing to our newsletter! Please click the
              button below to confirm your subscription.
            </p>
            <div className='mt-8 flex justify-center'>
              <Link
                path={`${process.env.HOME_URL}/confirmation?code=${code}`}
                text='Confirm Subscription'
              />
            </div>
            <Note>
              If you didn&apos;t subscribe to our newsletter, please ignore this
              email.
            </Note>
          </div>
        }
      />
    )
  };
}
