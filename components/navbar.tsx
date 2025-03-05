"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, DumbbellIcon, MenuIcon, XIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const pathname = usePathname()
  const [darkMode, setDarkMode] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Check if user prefers dark mode
    if (typeof window !== "undefined") {
      const isDarkMode =
        localStorage.getItem("darkMode") === "true" || window.matchMedia("(prefers-color-scheme: dark)").matches

      setDarkMode(isDarkMode)
      if (isDarkMode) {
        document.documentElement.classList.add("dark")
      }
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    if (typeof window !== "undefined") {
      localStorage.setItem("darkMode", (!darkMode).toString())
      document.documentElement.classList.toggle("dark")
    }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/chat", label: "Chat" },
    { href: "/create", label: "Create" },
    { href: "/history", label: "History" },
  ]

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <DumbbellIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">FitTrack</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="flex-1 hidden md:flex items-center justify-between">
          <div className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="ml-auto">
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden flex-1 justify-end">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="mr-2">
            {darkMode ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block py-2 px-3 rounded-md text-sm font-medium",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

