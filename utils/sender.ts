import { Resend } from 'resend';

type EmailTemplate = {
  subject: string;
  template: JSX.Element;
};

export async function sender(
  recipients: string[],
  { subject, template }: EmailTemplate
) {
  const resend = new Resend(process.env.RESEND_KEY);

  try {
    const { error } = await resend.batch.send(
      recipients.map(recipient => {
        return {
          from: process.env.RESEND_FROM!,
          to: recipient,
          subject,
          react: template,
          headers: {
            'List-Unsubscribe': `<${process.env.HOME_URL}/unsubscribe>`
          }
        };
      })
    );

    if (error) {
      console.error(error);
      return false;
    }

    console.log('Email sent', subject, recipients.length);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
