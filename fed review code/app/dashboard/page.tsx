"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function StudentDashboard() {
  const { user } = useAuth()
  const { resources, sessions } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "Student") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "Student") return null

  const recentResources = resources.slice(0, 3)
  const upcomingSessions = sessions.filter((s) => s.userId === user.id && s.status !== "Completed")

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome back, <span className="text-primary">{user.name}</span>
            </h1>
            <p className="text-muted-foreground">Here's your mental wellness dashboard</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-primary/20 animate-slide-in-left">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Upcoming Sessions</p>
                  <p className="text-3xl font-bold text-primary">{upcomingSessions.length}</p>
                </div>
                <span className="text-3xl">📅</span>
              </div>
            </Card>

            <Card className="p-6 border-accent/20 animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Resources Available</p>
                  <p className="text-3xl font-bold text-accent">{resources.length}</p>
                </div>
                <span className="text-3xl">📚</span>
              </div>
            </Card>

            <Card className="p-6 border-secondary/20 animate-slide-in-right">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm mb-1">Wellness Streak</p>
                  <p className="text-3xl font-bold text-secondary">12 days</p>
                </div>
                <span className="text-3xl">🔥</span>
              </div>
            </Card>
          </div>

          {/* Featured Resources */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Featured Resources</h2>
              <Link href="/resources">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentResources.map((resource, idx) => (
                <Card
                  key={resource.id}
                  className="p-6 border-border/50 hover:border-primary/50 transition-all hover:shadow-lg cursor-pointer group animate-fade-in"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{resource.icon}</div>
                  <h3 className="font-semibold text-foreground mb-2">{resource.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {resource.category}
                  </span>
                </Card>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/schedule">
              <Card className="p-8 border-primary/20 hover:border-primary/50 transition-all cursor-pointer group bg-gradient-to-br from-primary/10 to-transparent">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">📅</span>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">Schedule Session</h3>
                    <p className="text-muted-foreground">Book a counseling session with a professional</p>
                  </div>
                </div>
              </Card>
            </Link>
            <Link href="/support-group">
              <Card className="p-8 border-accent/20 hover:border-accent/50 transition-all cursor-pointer group bg-gradient-to-br from-accent/10 to-transparent">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">👥</span>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">Join Support Group</h3>
                    <p className="text-muted-foreground">Connect with peers in our community forum</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
