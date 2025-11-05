"use client"

import { useAuth } from "@/lib/auth-context"
import { useData } from "@/lib/data-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const counselors = [
  { id: "1", name: "Dr. Sarah Johnson", specialty: "Anxiety & Stress" },
  { id: "2", name: "Prof. Michael Chen", specialty: "Academic Pressure" },
  { id: "3", name: "Dr. Emma Wilson", specialty: "Relationship Issues" },
]

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]

export default function SchedulePage() {
  const { user } = useAuth()
  const { addSession, sessions } = useData()
  const router = useRouter()
  const [selectedCounselor, setSelectedCounselor] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  useEffect(() => {
    if (!user || user.role !== "Student") {
      router.push("/")
    }
  }, [user, router])

  const handleSchedule = () => {
    if (selectedCounselor && selectedDate && selectedTime) {
      const counselor = counselors.find((c) => c.id === selectedCounselor)
      addSession({
        id: Date.now().toString(),
        userId: user!.id,
        counselor: counselor!.name,
        date: selectedDate,
        time: selectedTime,
        status: "Pending",
      })
      alert("Session scheduled successfully! Pending admin approval.")
      setSelectedCounselor("")
      setSelectedDate("")
      setSelectedTime("")
    }
  }

  const userSessions = sessions.filter((s) => s.userId === user?.id)

  if (!user || user.role !== "Student") return null

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 animate-slide-in-left">
              <h1 className="text-4xl font-bold text-foreground mb-8">Schedule Your Session</h1>

              <Card className="p-8 border-primary/20">
                <div className="space-y-6">
                  {/* Counselor Selection */}
                  <div>
                    <label className="block text-foreground font-semibold mb-3">Select a Counselor</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {counselors.map((counselor) => (
                        <button
                          key={counselor.id}
                          onClick={() => setSelectedCounselor(counselor.id)}
                          className={`p-4 rounded-lg text-left transition-all ${
                            selectedCounselor === counselor.id
                              ? "bg-primary text-primary-foreground border-2 border-primary"
                              : "bg-card border border-border hover:border-primary"
                          }`}
                        >
                          <p className="font-semibold">{counselor.name}</p>
                          <p className="text-sm opacity-75">{counselor.specialty}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Selection */}
                  <div>
                    <label className="block text-foreground font-semibold mb-3">Select Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground"
                    />
                  </div>

                  {/* Time Selection */}
                  <div>
                    <label className="block text-foreground font-semibold mb-3">Select Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`p-2 rounded-lg text-sm transition-all ${
                            selectedTime === slot
                              ? "bg-primary text-primary-foreground"
                              : "bg-card border border-border hover:border-primary"
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleSchedule}
                    disabled={!selectedCounselor || !selectedDate || !selectedTime}
                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                  >
                    Schedule Session
                  </Button>
                </div>
              </Card>
            </div>

            {/* Session History */}
            <div className="animate-slide-in-right">
              <h2 className="text-2xl font-bold text-foreground mb-6">Your Sessions</h2>
              <div className="space-y-4">
                {userSessions.length === 0 ? (
                  <Card className="p-6 text-center border-border/50">
                    <p className="text-muted-foreground">No sessions scheduled yet</p>
                  </Card>
                ) : (
                  userSessions.map((session) => (
                    <Card key={session.id} className="p-4 border-border/50 hover:border-primary/50 transition-all">
                      <p className="font-semibold text-foreground mb-1">{session.counselor}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.date} at {session.time}
                      </p>
                      <div className="mt-3">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            session.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : session.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {session.status}
                        </span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
