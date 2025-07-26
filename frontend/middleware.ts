// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const email = request.cookies.get("email")?.value;
  const pathname = request.nextUrl.pathname;

  const isAdmin = "harshit15gg@gmail.com".includes(email || "") || false;

  // Auth routes - redirect authenticated users
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (token && isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }else if(token && !isAdmin){
      return NextResponse.redirect(new URL("/", request.url));
    }else{
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  

  // Admin route protection
  if (pathname.startsWith("/dashboard")) {
    if (!token || !isAdmin) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Note: Admin check will be handled by UserContext on the client side

  }

  // Authenticated user protection
  if (pathname.startsWith("/cart") || pathname.startsWith("/favourites")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
