import { CustomLink } from '../custom/customLink';
import { Note } from './components/note';
import Template from './template';

export default function UnsubscribeTemplate() {
  return {
    subject: 'Unsubscribe confirmation',
    template: (
      <Template
        title="We're sad to see you go :("
        body={
          <div style={{ fontSize: '1rem', color: '#4a5568' }}>
            <p style={{ marginTop: '0.5rem' }}>
              You have been successfully unsubscribed from our newsletter. You
              won&apos;t receive any further communications from us unless you
              explicitly opt-in again.
            </p>
            <div
              style={{
                margin: '2rem 0',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <CustomLink path='/' text='Re-subscribe' />
            </div>
            <Note>
              If you have any questions or concerns, please feel free to{' '}
              <a
                style={{ color: '#3b82f6', textDecoration: 'underline' }}
                href={`mailto:${process.env.NEXT_PUBLIC_BRAND_EMAIL}`}
              >
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
