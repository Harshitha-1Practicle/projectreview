"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Resource {
  id: string
  title: string
  description: string
  category: "Articles" | "Videos" | "Tools" | "Hotlines"
  link: string
  icon: string
}

export interface Post {
  id: string
  author: string
  authorId: string
  message: string
  replies: Reply[]
  likes: number
  createdAt: string
}

export interface Reply {
  id: string
  author: string
  authorId: string
  message: string
  createdAt: string
}

export interface Session {
  id: string
  userId: string
  counselor: string
  date: string
  time: string
  status: "Pending" | "Approved" | "Completed"
}

interface DataContextType {
  resources: Resource[]
  posts: Post[]
  sessions: Session[]
  addResource: (resource: Resource) => void
  deleteResource: (id: string) => void
  addPost: (post: Post) => void
  deletePost: (id: string) => void
  replyToPost: (postId: string, reply: Reply) => void
  likePost: (id: string) => void
  addSession: (session: Session) => void
  approveSession: (id: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const defaultResources: Resource[] = [
  {
    id: "1",
    title: "Understanding Anxiety",
    description: "Learn effective techniques to manage anxiety and stress.",
    category: "Articles",
    link: "#",
    icon: "📚",
  },
  {
    id: "2",
    title: "Meditation Guide",
    description: "A beginner-friendly guide to meditation and mindfulness.",
    category: "Videos",
    link: "#",
    icon: "🧘",
  },
  {
    id: "3",
    title: "Mental Health Hotline",
    description: "24/7 support available. Call or text for immediate help.",
    category: "Hotlines",
    link: "#",
    icon: "☎️",
  },
  {
    id: "4",
    title: "Sleep Better Tonight",
    description: "Science-backed tips for improving your sleep quality.",
    category: "Tools",
    link: "#",
    icon: "😴",
  },
]

const defaultPosts: Post[] = [
  {
    id: "1",
    author: "Emma",
    authorId: "user1",
    message: "Started my mindfulness journey today. Feeling hopeful!",
    replies: [],
    likes: 5,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    author: "James",
    authorId: "user2",
    message: "Does anyone have recommendations for managing exam stress?",
    replies: [
      {
        id: "r1",
        author: "Sophie",
        authorId: "user3",
        message: "Deep breathing exercises really helped me!",
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
    ],
    likes: 8,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<Resource[]>(defaultResources)
  const [posts, setPosts] = useState<Post[]>(defaultPosts)
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    const storedResources = localStorage.getItem("resources")
    const storedPosts = localStorage.getItem("posts")
    const storedSessions = localStorage.getItem("sessions")

    if (storedResources) setResources(JSON.parse(storedResources))
    if (storedPosts) setPosts(JSON.parse(storedPosts))
    if (storedSessions) setSessions(JSON.parse(storedSessions))
  }, [])

  useEffect(() => {
    localStorage.setItem("resources", JSON.stringify(resources))
  }, [resources])

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts))
  }, [posts])

  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions))
  }, [sessions])

  const addResource = (resource: Resource) => {
    setResources([resource, ...resources])
  }

  const deleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id))
  }

  const addPost = (post: Post) => {
    setPosts([post, ...posts])
  }

  const deletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id))
  }

  const replyToPost = (postId: string, reply: Reply) => {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, replies: [reply, ...p.replies] } : p)))
  }

  const likePost = (id: string) => {
    setPosts(posts.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p)))
  }

  const addSession = (session: Session) => {
    setSessions([session, ...sessions])
  }

  const approveSession = (id: string) => {
    setSessions(sessions.map((s) => (s.id === id ? { ...s, status: "Approved" } : s)))
  }

  return (
    <DataContext.Provider
      value={{
        resources,
        posts,
        sessions,
        addResource,
        deleteResource,
        addPost,
        deletePost,
        replyToPost,
        likePost,
        addSession,
        approveSession,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within DataProvider")
  }
  return context
}
