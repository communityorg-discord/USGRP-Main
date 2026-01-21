import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth?: { user?: { id?: string } } }) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname === "/login";
    const isApiRoute = req.nextUrl.pathname.startsWith("/api");
    const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/banking") ||
        req.nextUrl.pathname.startsWith("/transactions") ||
        req.nextUrl.pathname.startsWith("/payroll") ||
        req.nextUrl.pathname.startsWith("/loans") ||
        req.nextUrl.pathname.startsWith("/fines") ||
        req.nextUrl.pathname.startsWith("/housing") ||
        req.nextUrl.pathname.startsWith("/profile");

    // Allow API routes
    if (isApiRoute) {
        return NextResponse.next();
    }

    // Redirect to login if not logged in and trying to access protected route
    if (isDashboardRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect to dashboard if already logged in and on auth page
    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public).*)",
    ],
};
