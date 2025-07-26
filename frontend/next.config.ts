import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export const config = {
  matcher: ["/dashboard/:path*", "/cart/:path*", "/favourites/:path*"],
};
export default nextConfig;
