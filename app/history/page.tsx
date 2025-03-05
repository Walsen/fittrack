"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, DumbbellIcon, ArrowRightIcon, PlusIcon, Loader2Icon } from "lucide-react"
import type { Workout } from "@/lib/types"
import { getWorkouts } from "@/lib/storage"
import { formatDate } from "@/lib/utils"
import { motion } from "framer-motion"

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Small delay to simulate loading and ensure mock data is initialized
    const timer = setTimeout(() => {
      setWorkouts(getWorkouts().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-10 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Workout History</h1>
          <Link href="/create">
            <Button className="flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              New Workout
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center py-20">
          <Loader2Icon className="h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading your workout history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Workout History</h1>
        <Link href="/create">
          <Button className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            New Workout
          </Button>
        </Link>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-lg">
          <DumbbellIcon className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No workouts yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Create your first workout to start tracking your fitness journey
          </p>
          <Link href="/create">
            <Button>Create Workout</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{workout.title}</CardTitle>
                  <CardDescription className="flex items-center text-sm">
                    <CalendarIcon className="h-3.5 w-3.5 mr-1.5" />
                    {formatDate(workout.date)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      {workout.items.length} {workout.items.length === 1 ? "exercise" : "exercises"}
                    </p>
                    <ul className="text-sm space-y-1">
                      {workout.items.slice(0, 3).map((item) => (
                        <li key={item.id} className="truncate">
                          • {item.name} ({item.repeats} reps, {item.weight} kg)
                        </li>
                      ))}
                      {workout.items.length > 3 && (
                        <li className="text-muted-foreground">+ {workout.items.length - 3} more</li>
                      )}
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/workout/${workout.id}`} className="w-full">
                    <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                      View Details
                      <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

