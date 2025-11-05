"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminDashboard() {
  const { user } = useAuth()
  const { posts, sessions, resources, approveSession } = useData()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role !== "Admin") {
      router.push("/")
    }
  }, [user, router])

  if (!user || user.role !== "Admin") return null

  const pendingSessions = sessions.filter((s) => s.status === "Pending")

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome */}
          <div className="mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage resources, sessions, and community</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="p-6 border-primary/20 animate-slide-in-left">
              <p className="text-muted-foreground text-sm mb-2">Total Resources</p>
              <p className="text-3xl font-bold text-primary">{resources.length}</p>
            </Card>
            <Card className="p-6 border-accent/20 animate-scale-in" style={{ animationDelay: "0.1s" }}>
              <p className="text-muted-foreground text-sm mb-2">Total Posts</p>
              <p className="text-3xl font-bold text-accent">{posts.length}</p>
            </Card>
            <Card className="p-6 border-secondary/20 animate-slide-in-right">
              <p className="text-muted-foreground text-sm mb-2">Total Sessions</p>
              <p className="text-3xl font-bold text-secondary">{sessions.length}</p>
            </Card>
            <Card className="p-6 border-destructive/20 animate-fade-in" style={{ animationDelay: "0.15s" }}>
              <p className="text-muted-foreground text-sm mb-2">Pending Approvals</p>
              <p className="text-3xl font-bold text-destructive">{pendingSessions.length}</p>
            </Card>
          </div>

          {/* Pending Sessions */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Pending Session Approvals</h2>
            {pendingSessions.length === 0 ? (
              <Card className="p-6 text-center border-border/50">
                <p className="text-muted-foreground">No pending sessions</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {pendingSessions.map((session, idx) => (
                  <Card
                    key={session.id}
                    className="p-6 border-border/50 hover:border-primary/50 transition-all animate-fade-in"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-foreground">{session.counselor}</p>
                        <p className="text-muted-foreground text-sm">
                          {session.date} at {session.time}
                        </p>
                      </div>
                      <Button
                        onClick={() => approveSession(session.id)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        Approve
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <a href="/resources">
              <Card className="p-8 border-primary/20 hover:border-primary/50 transition-all cursor-pointer bg-gradient-to-br from-primary/10 to-transparent">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">📚</span>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">Manage Resources</h3>
                    <p className="text-muted-foreground">Add, edit, or remove wellness resources</p>
                  </div>
                </div>
              </Card>
            </a>
            <a href="/support-group">
              <Card className="p-8 border-accent/20 hover:border-accent/50 transition-all cursor-pointer bg-gradient-to-br from-accent/10 to-transparent">
                <div className="flex items-center gap-4">
                  <span className="text-5xl">👥</span>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-1">Moderate Forum</h3>
                    <p className="text-muted-foreground">Review and moderate community posts</p>
                  </div>
                </div>
              </Card>
            </a>
          </div>
        </div>
      </main>
    </>
  )
}
