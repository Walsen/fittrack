import type React from "react"
import type { Metadata } from "next"
import { Mona_Sans as FontSans } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import { cn } from "@/lib/utils"
import MockDataInitializer from "@/components/mock-data-initializer"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "FitTrack - Your Workout Assistant",
  description: "Track your workouts, get fitness advice, and achieve your goals",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <div className="flex-1">{children}</div>
          <MockDataInitializer />
        </div>
      </body>
    </html>
  )
}

