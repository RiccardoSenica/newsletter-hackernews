import { Resend } from 'resend';

type EmailTemplate = {
  subject: string;
  template: JSX.Element;
};

export async function sender(
  to: string[],
  { subject, template }: EmailTemplate
) {
  const resend = new Resend(process.env.RESEND_KEY);

  try {
    const { error } = await resend.batch.send(
      to.map(t => {
        return {
          from: process.env.RESEND_FROM!,
          to: t,
          subject,
          react: template,
          headers: {
            'List-Unsubscribe': `<${process.env.HOME_URL}/unsubscribe>`
          }
        };
      })
    );

    if (error) {
      console.log(error);

      return false;
    }
  } catch (error) {
    console.log(error);

    return false;
  }

  console.log('Email sent', subject, to.length);

  return true;
}
