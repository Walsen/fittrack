"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusIcon, TrashIcon, DumbbellIcon, SaveIcon } from "lucide-react"
import type { Workout, WorkoutItem } from "@/lib/types"
import { saveWorkout } from "@/lib/storage"
import { motion } from "framer-motion"

export default function CreateWorkout() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [items, setItems] = useState<WorkoutItem[]>([{ id: uuidv4(), name: "", repeats: 0, weight: 0 }])

  const addWorkoutItem = () => {
    setItems([...items, { id: uuidv4(), name: "", repeats: 0, weight: 0 }])
  }

  const removeWorkoutItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id))
    }
  }

  const updateWorkoutItem = (id: string, field: keyof WorkoutItem, value: string | number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!title.trim()) {
      alert("Please enter a workout title")
      return
    }

    if (items.some((item) => !item.name.trim())) {
      alert("Please enter a name for all workout items")
      return
    }

    // Create workout object
    const workout: Workout = {
      id: uuidv4(),
      title,
      date: new Date().toISOString(),
      items,
    }

    // Save workout
    saveWorkout(workout)

    // Redirect to history page
    router.push("/history")
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Create Workout</h1>
        <Button onClick={handleSubmit} className="flex items-center gap-2">
          <SaveIcon className="h-4 w-4" />
          Save Workout
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-8 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Workout Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="title" className="text-base">
                Workout Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Monday Upper Body"
                className="mt-1.5"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Exercises</h2>
          <Button type="button" variant="outline" onClick={addWorkoutItem} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" /> Add Exercise
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-10 border border-dashed rounded-lg">
            <DumbbellIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No exercises added yet</p>
            <Button type="button" variant="outline" onClick={addWorkoutItem} className="mt-4">
              Add Your First Exercise
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Exercise {index + 1}</h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWorkoutItem(item.id)}
                        disabled={items.length === 1}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`name-${item.id}`}>Exercise Name</Label>
                        <Input
                          id={`name-${item.id}`}
                          value={item.name}
                          onChange={(e) => updateWorkoutItem(item.id, "name", e.target.value)}
                          placeholder="e.g., Bench Press"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`repeats-${item.id}`}>Repeats</Label>
                        <Input
                          id={`repeats-${item.id}`}
                          type="number"
                          min="0"
                          value={item.repeats}
                          onChange={(e) => updateWorkoutItem(item.id, "repeats", Number.parseInt(e.target.value) || 0)}
                          placeholder="e.g., 12"
                          className="mt-1.5"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`weight-${item.id}`}>Weight (kg)</Label>
                        <Input
                          id={`weight-${item.id}`}
                          type="number"
                          min="0"
                          step="0.5"
                          value={item.weight}
                          onChange={(e) => updateWorkoutItem(item.id, "weight", Number.parseFloat(e.target.value) || 0)}
                          placeholder="e.g., 60"
                          className="mt-1.5"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </form>
    </div>
  )
}

