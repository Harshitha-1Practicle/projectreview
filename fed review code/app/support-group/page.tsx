"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SupportGroupPage() {
  const { user } = useAuth()
  const { posts, addPost, deletePost, replyToPost, likePost } = useData()
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyMessage, setReplyMessage] = useState("")

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      addPost({
        id: Date.now().toString(),
        author: user!.name,
        authorId: user!.id,
        message,
        replies: [],
        likes: 0,
        createdAt: new Date().toISOString(),
      })
      setMessage("")
      setShowForm(false)
    }
  }

  const handleReply = (postId: string) => {
    if (replyMessage.trim()) {
      replyToPost(postId, {
        id: Date.now().toString(),
        author: user!.name,
        authorId: user!.id,
        message: replyMessage,
        createdAt: new Date().toISOString(),
      })
      setReplyMessage("")
      setReplyingTo(null)
    }
  }

  if (!user) return null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-foreground mb-2">Support Group Forum</h1>
            <p className="text-muted-foreground">Share your journey and support fellow students</p>
          </div>

          {/* Create Post Button */}
          <div className="mb-8">
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {showForm ? "Cancel" : "Share Your Story"}
            </Button>
          </div>

          {/* Create Post Form */}
          {showForm && (
            <Card className="p-6 mb-8 border-primary/20 animate-scale-in">
              <form onSubmit={handleCreatePost} className="space-y-4">
                <textarea
                  placeholder="Share your thoughts, experiences, or questions with the community..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-24"
                />
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowForm(false)
                      setMessage("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    Post
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Posts List */}
          <div className="space-y-6">
            {posts.map((post, idx) => (
              <Card
                key={post.id}
                className="p-6 border-border/50 hover:border-primary/50 transition-all animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                {/* Post Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold text-foreground">{post.author}</p>
                    <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  {user.role === "Admin" && (
                    <Button
                      onClick={() => deletePost(post.id)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                    >
                      Delete
                    </Button>
                  )}
                </div>

                {/* Post Message */}
                <p className="text-foreground mb-4">{post.message}</p>

                {/* Post Actions */}
                <div className="flex gap-4 mb-4">
                  <button
                    onClick={() => likePost(post.id)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                  >
                    <span>❤️</span>
                    <span className="text-sm">{post.likes}</span>
                  </button>
                  <button
                    onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    Reply ({post.replies.length})
                  </button>
                </div>

                {/* Replies */}
                {post.replies.length > 0 && (
                  <div className="space-y-3 mb-4 pl-4 border-l-2 border-primary/20">
                    {post.replies.map((reply) => (
                      <div key={reply.id}>
                        <p className="font-semibold text-foreground text-sm">{reply.author}</p>
                        <p className="text-muted-foreground text-sm">{reply.message}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === post.id && (
                  <div className="space-y-2 pt-4 border-t border-border animate-scale-in">
                    <textarea
                      placeholder="Write your reply..."
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground text-sm"
                      rows={2}
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setReplyingTo(null)
                          setReplyMessage("")
                        }}
                        className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                      <Button onClick={() => handleReply(post.id)} size="sm" className="bg-primary hover:bg-primary/90">
                        Reply
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No posts yet. Be the first to share your story!</p>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
