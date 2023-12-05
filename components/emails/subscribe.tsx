import Email from './template';

export default function ConfirmationEmail(code: string) {
  return {
    subject: 'Welcome!',
    template: (
      <Email
        title={'Welcome!'}
        body={
          <>
            Thank you for subscribing. Please confirm your email address by
            clicking{' '}
            <a href={`${process.env.HOME_URL}/confirmation?code=${code}`}>
              here
            </a>
            .
          </>
        }
      />
    )
  };
}
