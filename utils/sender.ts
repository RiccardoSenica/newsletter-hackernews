import { Resend } from 'resend';

type EmailTemplate = {
  subject: string;
  template: JSX.Element;
};

async function sendEmail(to: string[], { subject, template }: EmailTemplate) {
  const resend = new Resend(process.env.RESEND_KEY);

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to,
      subject,
      react: template,
      headers: {
        'List-Unsubscribe': `<${process.env.HOME_URL}/unsubscribe>`
      }
    });

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

export async function sender(
  to: string[],
  { subject, template }: EmailTemplate
) {
  let success = false;
  let i = 5;

  while (i < 5) {
    const sent = await sendEmail(to, { subject, template });
    if (sent) {
      success = true;
      break;
    }
    i++;
  }

  return success;
}
