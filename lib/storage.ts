"use client"

import type { Workout } from "./types"

// Save workout to local storage
export const saveWorkout = (workout: Workout): void => {
  if (typeof window === "undefined") return

  const workouts = getWorkouts()
  workouts.push(workout)
  localStorage.setItem("workouts", JSON.stringify(workouts))
}

// Get all workouts from local storage
export const getWorkouts = (): Workout[] => {
  if (typeof window === "undefined") return []

  const workoutsJson = localStorage.getItem("workouts")
  return workoutsJson ? JSON.parse(workoutsJson) : []
}

// Get a specific workout by ID
export const getWorkoutById = (id: string): Workout | undefined => {
  const workouts = getWorkouts()
  return workouts.find((workout) => workout.id === id)
}

// Delete a workout by ID
export const deleteWorkout = (id: string): void => {
  if (typeof window === "undefined") return

  const workouts = getWorkouts()
  const updatedWorkouts = workouts.filter((workout) => workout.id !== id)
  localStorage.setItem("workouts", JSON.stringify(updatedWorkouts))
}

