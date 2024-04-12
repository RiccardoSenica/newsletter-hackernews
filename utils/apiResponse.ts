import { NextResponse } from 'next/server';

export function ApiResponse(status: number, message: unknown) {
  const stringMessage = JSON.stringify(message);
  const response = new NextResponse(stringMessage, { status });
  response.headers.set('Access-Control-Allow-Origin', process.env.HOME_URL!);

  return response;
}
