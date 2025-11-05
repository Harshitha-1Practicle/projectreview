"use client"

import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  if (!user) return null

  const navLinks =
    user.role === "Admin"
      ? [
          { href: "/admin", label: "Dashboard" },
          { href: "/resources", label: "Resources" },
          { href: "/support-group", label: "Forum" },
        ]
      : [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/resources", label: "Resources" },
          { href: "/schedule", label: "Schedule" },
          { href: "/support-group", label: "Support Group" },
        ]

  return (
    <nav className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={user.role === "Admin" ? "/admin" : "/dashboard"} className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">MindFlow</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setOpen(!open)} className="md:hidden">
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden pb-4 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-foreground hover:text-primary transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
