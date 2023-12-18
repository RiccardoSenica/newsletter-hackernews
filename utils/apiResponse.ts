import { NextResponse } from 'next/server';

export function ApiResponse(status: number, message: string) {
  const response = new NextResponse(message, { status });
  response.headers.set('Access-Control-Allow-Origin', process.env.HOME_URL!);

  return response;
}
