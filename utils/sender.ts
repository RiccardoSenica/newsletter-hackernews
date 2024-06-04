import { Resend } from 'resend';

interface EmailTemplate {
  subject: string;
  template: JSX.Element;
}

export async function sender(
  recipients: string[],
  { subject, template }: EmailTemplate
) {
  if (recipients.length === 0) {
    console.info(`${subject} email skipped for having zero recipients`);
    return true;
  }

  const resend = new Resend(process.env.RESEND_KEY);

  try {
    let response;

    if (recipients.length == 1) {
      response = await resend.emails.send({
        from: process.env.RESEND_FROM!,
        to: recipients[0],
        subject,
        react: template,
        headers: {
          'List-Unsubscribe': `<${process.env.HOME_URL}/unsubscribe>`
        }
      });
    } else {
      response = await resend.batch.send(
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
    }

    const { error } = response;

    if (error) {
      console.error(error);
      return false;
    }

    console.info(`${subject} email sent to ${recipients.length} recipients`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
