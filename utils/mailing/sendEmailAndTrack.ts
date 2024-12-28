import { PrismaClient, User } from '@prisma/client';
import { sender } from './nodemailer';
import { EmailTemplate } from '../types';

interface SendEmailResult {
  success: boolean;
  error?: string;
}

export async function sendEmailAndTrack(
  user: User,
  template: EmailTemplate,
  prisma: PrismaClient
): Promise<SendEmailResult> {
  try {
    const sent = await sender([user], template, prisma);
    if (!sent) {
      return { success: false, error: 'Failed to send email' };
    }

    await prisma.$transaction(async tx => {
      const emailRecord = await tx.email.create({
        data: {
          subject: template.subject,
          body: JSON.stringify(template.body)
        }
      });

      await tx.emailUser.create({
        data: {
          userId: user.id,
          emailId: emailRecord.id
        }
      });
    });

    return { success: true };
  } catch (error) {
    console.error('Error in send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
