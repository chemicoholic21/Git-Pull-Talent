import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const ip = request.ip ?? request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for");
  
  if (ip) {
    response.headers.set("x-forwarded-for", ip);
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
