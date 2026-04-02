"use client";

import type React from "react";
import { Mona_Sans as FontSans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { cn } from "@/lib/utils";

import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import amplifyConfig from "../amplify_outputs.json";

if (Object.keys(amplifyConfig).length > 0) {
  Amplify.configure(amplifyConfig);
}

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className="flex justify-center items-center min-h-screen">
          <Authenticator>
            <div className="relative flex min-h-screen flex-col w-full">
              <Navbar />
              <div className="flex-1">{children}</div>
            </div>
          </Authenticator>
        </div>
      </body>
    </html>
  );
}
