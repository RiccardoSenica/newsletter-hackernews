import prisma from '../../../prisma/prisma';
import { ApiResponse } from '../../../utils/apiResponse';

export async function GET() {
  const news = await prisma.news.findMany({
    orderBy: {
      createdAt: 'desc'
    },
    take: 100
  });

  if (news && news.length === 100) {
    return ApiResponse(200, JSON.stringify(news));
  }

  return ApiResponse(500, 'Internal server error');
}
