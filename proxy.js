import { NextResponse } from "next/server";

export function proxy(req) {
  const isLoggedIn = req.cookies.get("admin");
  const path = req.nextUrl.pathname;

  // ✅ allow login page
  if (path === "/admin/login") {
    return NextResponse.next();
  }

  // ✅ allow API routes
  if (path.startsWith("/api")) {
    return NextResponse.next();
  }

  // 🔒 protect admin routes
  if (path.startsWith("/admin") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}