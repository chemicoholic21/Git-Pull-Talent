import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "@/providers/QueryProvider";
import RateLimitBanner from "@/components/RateLimitBanner";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://gitpulltalent.vercel.app/"),
  title: "GitPullTalent | Developer Intelligence Protocol",
  description: "Advanced GitHub developer analytics and scoring system.",
  openGraph: {
    title: "GitPullTalent — GitHub Impact Analytics",
    description: "Discover the true impact of open-source contributions.",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "GitPullTalent — GitHub Impact Analytics",
    description: "Discover the true impact of open-source contributions.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen relative bg-[#0b0f1a] text-slate-300 font-mono" suppressHydrationWarning>
        <SessionProvider>
          <QueryProvider>
            <Navbar />
            <main className="relative z-10 pt-20">{children}</main>
            <RateLimitBanner />
          </QueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
