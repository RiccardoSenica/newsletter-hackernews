import prisma from '../../../prisma/prisma';
import { ApiResponse } from '../../../utils/apiResponse';
import {
  STATUS_INTERNAL_SERVER_ERROR,
  STATUS_OK
} from '../../../utils/statusCodes';

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
      return ApiResponse(STATUS_OK, news);
    }
  } catch (error) {
    console.error(error);
    return ApiResponse(STATUS_INTERNAL_SERVER_ERROR, 'Internal server error');
  }
}
