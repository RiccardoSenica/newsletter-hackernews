import { NewsletterTemplate } from '@components/email/Newsletter';
import prisma from '@prisma/prisma';
import { formatApiResponse } from '@utils/formatApiResponse';
import { sender } from '@utils/mailing/nodemailer';
import {
  INTERNAL_SERVER_ERROR,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK,
  STATUS_UNAUTHORIZED
} from '@utils/statusCodes';
import { NextRequest } from 'next/server';

const ONE_DAY_IN_MS = 1000 * 60 * 60 * 24;
const DELTA_MINUTES_IN_MS = 1000 * 60 * 60;

export async function GET(request: NextRequest) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return formatApiResponse(STATUS_UNAUTHORIZED, 'Unauthorized');
  }

  if (!process.env.NEWS_TO_USE) {
    throw new Error('Environment variable (NEWS_TO_USE) is not set.');
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        confirmed: true,
        deleted: false,
        OR: [
          {
            lastMail: {
              lt: new Date(Date.now() - ONE_DAY_IN_MS + DELTA_MINUTES_IN_MS) // 24h - 60m
            }
          },
          {
            lastMail: null
          }
        ]
      },
      select: {
        id: true,
        email: true
      }
    });

    console.info(`Found ${users.length} users to mail to.`);

    if (users.length === 0) {
      return formatApiResponse(STATUS_OK, 'No user to mail to.');
    }

    const news = await prisma.news.findMany({
      where: {
        createdAt: {
          gt: new Date(Date.now() - ONE_DAY_IN_MS)
        }
      },
      orderBy: {
        score: 'desc'
      },
      take: Number(process.env.NEWS_TO_USE)
    });

    console.info(`Found ${news.length} news to include in the newsletter.`);

    if (news.length === 0) {
      return formatApiResponse(STATUS_OK, 'No news to include in newsletter.');
    }

    const rankedNews = news.sort((a, b) => b.score - a.score);

    const template = await NewsletterTemplate(rankedNews);

    const emailRecord = await prisma.email.create({
      data: {
        subject: template.subject,
        body: JSON.stringify(template.body)
      }
    });

    const sent = await sender(users, template, prisma);

    if (!sent) {
      return formatApiResponse(
        STATUS_INTERNAL_SERVER_ERROR,
        INTERNAL_SERVER_ERROR
      );
    }

    const BATCH_SIZE = 1000;
    for (let i = 0; i < users.length; i += BATCH_SIZE) {
      const batch = users.slice(i, i + BATCH_SIZE);
      await prisma.emailUser.createMany({
        data: batch.map(u => ({
          userId: u.id,
          emailId: emailRecord.id
        }))
      });
    }

    return formatApiResponse(
      STATUS_OK,
      `Newsletter sent to ${users.length} addresses.`
    );
  } catch (error) {
    console.error(error);
    return formatApiResponse(
      STATUS_INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  }
}
