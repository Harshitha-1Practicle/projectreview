"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type UserRole = "Student" | "Admin"

export interface User {
  id: string
  name: string
  role: UserRole
  email?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (role: UserRole, name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setIsLoading(false)
  }, [])

  const login = (role: UserRole, name: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      role,
      email: `${name.toLowerCase().replace(/\s/g, ".")}@student.edu`,
      bio: "I am a student seeking mental health support",
    }
    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("resources")
    localStorage.removeItem("posts")
    localStorage.removeItem("sessions")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
