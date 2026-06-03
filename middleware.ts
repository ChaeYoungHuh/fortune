import { NextRequest, NextResponse } from "next/server";

const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

function randomToken(len = 8): string {
  let t = "";
  for (let i = 0; i < len; i++) {
    t += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return t;
}

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  if (!searchParams.has("v")) {
    const url = request.nextUrl.clone();
    url.searchParams.set("v", randomToken());
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
