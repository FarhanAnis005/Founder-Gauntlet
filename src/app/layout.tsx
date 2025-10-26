// File: frontend/src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header"; // We'll redesign this soon

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Founders Gauntlet",
  description: "Practice your pitch",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-primary-bg`}>
          {/* This div creates the subtle spotlight effect */}
          <div className="fixed left-0 top-0 -z-10 h-full w-full">
            <div className="absolute inset-0 -z-10 h-full w-full bg-primary-bg bg-[radial-gradient(#EAEAEA33_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#007BFF33,transparent)]"></div>
          </div>

          <Header />
          <main className="p-4 sm:p-6 md:p-8">{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
