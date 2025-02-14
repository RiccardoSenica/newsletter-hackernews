import prisma from '@prisma/prisma';
import { formatApiResponse } from '@utils/formatApiResponse';
import {
  INTERNAL_SERVER_ERROR,
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK
} from '@utils/statusCodes';

export async function GET() {
  try {
    const news = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: 50,
      select: {
        id: true,
        title: true,
        by: true
      }
    });

    if (news) {
      return formatApiResponse(STATUS_OK, news);
    }
  } catch (error) {
    console.error(error);
    return formatApiResponse(
      STATUS_INTERNAL_SERVER_ERROR,
      INTERNAL_SERVER_ERROR
    );
  }
}
