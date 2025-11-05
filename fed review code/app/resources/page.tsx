"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const categories = ["All", "Articles", "Videos", "Tools", "Hotlines"]

export default function ResourcesPage() {
  const { user } = useAuth()
  const { resources, addResource, deleteResource } = useData()
  const router = useRouter()
  const [filter, setFilter] = useState("All")
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Articles" as const,
    link: "",
    icon: "📚",
  })
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  const filteredResources = resources
    .filter((r) => filter === "All" || r.category === filter)
    .filter((r) => r.title.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault()
    if (user?.role === "Admin" && formData.title) {
      addResource({
        id: Date.now().toString(),
        ...formData,
      })
      setFormData({ title: "", description: "", category: "Articles", link: "", icon: "📚" })
      setShowForm(false)
    }
  }

  if (!user) return null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2">Wellness Resources</h1>
            <p className="text-muted-foreground">
              Explore articles, videos, and tools to support your mental health journey
            </p>
          </div>

          {/* Search and Add */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {user.role === "Admin" && (
              <Button onClick={() => setShowForm(!showForm)} className="bg-primary hover:bg-primary/90">
                {showForm ? "Cancel" : "Add Resource"}
              </Button>
            )}
          </div>

          {/* Add Resource Form */}
          {showForm && user.role === "Admin" && (
            <Card className="p-6 mb-8 border-primary/20 animate-scale-in">
              <form onSubmit={handleAddResource} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground h-24"
                />
                <div className="grid md:grid-cols-3 gap-4">
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  >
                    {categories.slice(1).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Icon (emoji)"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    maxLength={2}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground text-center"
                  />
                  <input
                    type="text"
                    placeholder="Link"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground"
                  />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Add Resource
                </Button>
              </form>
            </Card>
          )}

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-8 animate-fade-in">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full transition-all ${
                  filter === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border hover:border-primary text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Resources Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource, idx) => (
              <Card
                key={resource.id}
                className="p-6 border-border/50 hover:border-primary/50 transition-all hover:shadow-lg group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className="text-4xl group-hover:scale-110 transition-transform">{resource.icon}</span>
                  {user.role === "Admin" && (
                    <Button
                      onClick={() => deleteResource(resource.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      ×
                    </Button>
                  )}
                </div>
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {resource.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {resource.category}
                  </span>
                  <a
                    href={resource.link}
                    className="text-primary hover:text-primary/70 text-sm font-medium transition-colors"
                  >
                    View →
                  </a>
                </div>
              </Card>
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No resources found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
