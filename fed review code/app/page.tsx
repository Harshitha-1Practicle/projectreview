"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  const { user, login } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")

  useEffect(() => {
    if (user) {
      router.push(user.role === "Admin" ? "/admin" : "/dashboard")
    }
  }, [user, router])

  const handleLogin = (role: "Student" | "Admin") => {
    const displayName = name || (role === "Admin" ? "Admin User" : "Student")
    login(role, displayName)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col justify-center items-center">
        <div className="text-center space-y-8 animate-fade-in">
          {/* Logo and Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-foreground">
              <span className="text-primary">MindFlow</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">Your Safe Space for Mental Health Support</p>
          </div>

          {/* Description */}
          <div className="space-y-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            <p>Connect with counselors, access wellness resources, and join a supportive community of students.</p>
            <p>All in one secure, confidential platform.</p>
          </div>

          {/* Login Section */}
          <Card className="p-8 max-w-md mx-auto border-primary/20 bg-card/50 backdrop-blur">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
              />
              <div className="space-y-2">
                <Button
                  onClick={() => handleLogin("Student")}
                  className="w-full h-12 text-base bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all hover:shadow-lg"
                >
                  Continue as Student
                </Button>
                <Button
                  onClick={() => handleLogin("Admin")}
                  variant="outline"
                  className="w-full h-12 text-base border-primary/30 text-primary hover:bg-primary/10 rounded-lg transition-all"
                >
                  Continue as Admin
                </Button>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur animate-slide-in-left">
              <div className="text-4xl mb-3">🧘</div>
              <h3 className="font-semibold text-foreground mb-2">Wellness Resources</h3>
              <p className="text-muted-foreground text-sm">
                Access curated articles, videos, and tools for your mental health journey
              </p>
            </div>
            <div
              className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur animate-scale-in"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="text-4xl mb-3">👥</div>
              <h3 className="font-semibold text-foreground mb-2">Support Community</h3>
              <p className="text-muted-foreground text-sm">
                Connect with peers, share experiences, and support each other
              </p>
            </div>
            <div className="p-6 rounded-xl bg-card/50 border border-border/50 backdrop-blur animate-slide-in-right">
              <div className="text-4xl mb-3">📅</div>
              <h3 className="font-semibold text-foreground mb-2">Session Booking</h3>
              <p className="text-muted-foreground text-sm">
                Schedule counseling sessions at convenient times with qualified professionals
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
