import { Resend } from 'resend';

type EmailTemplate = {
  subject: string;
  template: JSX.Element;
};

export async function sendEmail(
  to: string[],
  { subject, template }: EmailTemplate
) {
  const resend = new Resend(process.env.RESEND_KEY);

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to,
      subject,
      react: template,
    });

    if (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }

  console.log('Email sent', subject, to.length);
}
