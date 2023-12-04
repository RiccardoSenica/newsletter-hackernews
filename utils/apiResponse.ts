export function ApiResponse(status: number, message: string) {
  const response = new Response(message, { status });
  response.headers.set('Access-Control-Allow-Origin', process.env.HOME_URL!);

  return response;
}
