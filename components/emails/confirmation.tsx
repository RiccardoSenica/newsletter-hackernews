import Note from './components/note';
import Template from './template';

export default function ConfirmationTemplate(code: string) {
  return {
    subject: 'Welcome!',
    template: (
      <Template
        title='Welcome!'
        body={
          <div style={{ fontSize: '1rem', color: '#4a5568' }}>
            <p>Dear subscriber,</p>
            <p style={{ marginTop: '0.5rem' }}>
              thank you for subscribing to our newsletter! Please click the link
              below to confirm your subscription.
            </p>
            <div
              style={{
                margin: '2rem 0',
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <a href={`${process.env.HOME_URL}/confirmation?code=${code}`}>
                {'Confirm subscription'}
              </a>
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
