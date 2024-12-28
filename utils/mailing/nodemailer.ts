import nodemailer from 'nodemailer';
import { render } from '@react-email/render';
import { EmailTemplate, UserEmail } from '../types';
import { PrismaClient } from '@prisma/client';

const connectionPool: { [key: string]: nodemailer.Transporter } = {};

const getTransporter = () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    throw new Error('Missing email credentials in environment variables.');
  }

  const key = `${process.env.SMTP_HOST}:${process.env.SMTP_PORT}:${process.env.SMTP_USER}`;

  if (!connectionPool[key]) {
    connectionPool[key] = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      requireTLS: true,
      pool: true,
      maxConnections: 5,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }

  return connectionPool[key];
};

async function processBatch(
  batch: UserEmail[],
  htmlContent: string,
  subject: string,
  transporter: nodemailer.Transporter,
  prisma: PrismaClient
) {
  const emailPromises = batch.map(async ({ id, email }) => {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email,
        subject,
        html: htmlContent,
        headers: {
          'List-Unsubscribe': `<${process.env.HOME_URL}/unsubscribe>`
        }
      });
      return { id, email, success: true };
    } catch (error) {
      console.error(`Failed to send email "${subject}" to ${email}:`, error);
      return { id, email, success: false };
    }
  });

  const results = await Promise.all(emailPromises);

  const successfulIds = results.filter(r => r.success).map(r => r.id);
  if (successfulIds.length > 0) {
    await prisma.user.updateMany({
      where: {
        id: { in: successfulIds }
      },
      data: {
        lastMail: new Date()
      }
    });
  }

  return results;
}

export async function sender(
  users: UserEmail[],
  { subject, body }: EmailTemplate,
  prisma: PrismaClient
): Promise<boolean> {
  if (!process.env.SMTP_FROM) {
    throw new Error('Missing email credentials in environment variables.');
  }

  const BATCH_SIZE = 50;

  const transporter = getTransporter();
  const htmlContent = await render(body);

  try {
    await transporter.verify();

    const batches = [];
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      batches.push(users.slice(i, i + BATCH_SIZE));
    }

    let successCount = 0;
    for (const batch of batches) {
      const results = await processBatch(
        batch,
        htmlContent,
        subject,
        transporter,
        prisma
      );
      successCount += results.filter(r => r.success).length;

      if (batches.length > 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.info(
      `${subject} email sent successfully to ${successCount}/${users.length} recipients`
    );
    return successCount > 0;
  } catch (error) {
    console.error('Error in email sending process:', error);
    return false;
  }
}
