import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

interface EmailTemplate {
  subject: string;
  body: JSX.Element;
}

const createTransporter = () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error('Missing email credentials in environment variables');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

export async function sender(
  recipients: string[],
  { subject, body }: EmailTemplate
): Promise<boolean> {
  if (!process.env.SMTP_FROM) {
    throw new Error('Missing email credentials in environment variables');
  }

  const transporter = createTransporter();

  try {
    await transporter.verify();

    const htmlContent = await render(body);

    const sendPromises = recipients.map(recipient =>
      transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: recipient,
        subject,
        html: htmlContent,
        headers: {
          'List-Unsubscribe': `<${process.env.HOME_URL}/unsubscribe>`
        }
      })
    );

    await Promise.all(sendPromises);
    console.info(`${subject} email sent to ${recipients.length} recipients`);

    return true;
  } catch (error) {
    console.error('Error in email sending process:', error);

    return false;
  } finally {
    if (transporter) {
      transporter.close();
    }
  }
}
