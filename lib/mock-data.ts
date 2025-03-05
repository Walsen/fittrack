import type { Workout, WorkoutItem } from "./types"
import { v4 as uuidv4 } from "uuid"

// Mock workout items for different workout types
const upperBodyExercises: Partial<WorkoutItem>[] = [
  { name: "Bench Press", repeats: 12, weight: 60 },
  { name: "Overhead Press", repeats: 10, weight: 40 },
  { name: "Lat Pulldown", repeats: 12, weight: 50 },
  { name: "Bicep Curls", repeats: 15, weight: 15 },
  { name: "Tricep Extensions", repeats: 15, weight: 20 },
  { name: "Dumbbell Rows", repeats: 12, weight: 22.5 },
  { name: "Push-ups", repeats: 20, weight: 0 },
  { name: "Pull-ups", repeats: 8, weight: 0 },
]

const lowerBodyExercises: Partial<WorkoutItem>[] = [
  { name: "Squats", repeats: 12, weight: 80 },
  { name: "Deadlifts", repeats: 8, weight: 100 },
  { name: "Leg Press", repeats: 15, weight: 120 },
  { name: "Lunges", repeats: 10, weight: 20 },
  { name: "Calf Raises", repeats: 20, weight: 30 },
  { name: "Leg Extensions", repeats: 15, weight: 40 },
  { name: "Hamstring Curls", repeats: 12, weight: 35 },
  { name: "Hip Thrusts", repeats: 15, weight: 60 },
]

const coreExercises: Partial<WorkoutItem>[] = [
  { name: "Crunches", repeats: 20, weight: 0 },
  { name: "Plank", repeats: 3, weight: 0 },
  { name: "Russian Twists", repeats: 15, weight: 10 },
  { name: "Leg Raises", repeats: 12, weight: 0 },
  { name: "Mountain Climbers", repeats: 30, weight: 0 },
  { name: "Ab Rollouts", repeats: 10, weight: 0 },
  { name: "Side Planks", repeats: 3, weight: 0 },
  { name: "Bicycle Crunches", repeats: 20, weight: 0 },
]

const cardioExercises: Partial<WorkoutItem>[] = [
  { name: "Treadmill Run", repeats: 1, weight: 0 },
  { name: "Cycling", repeats: 1, weight: 0 },
  { name: "Jumping Jacks", repeats: 50, weight: 0 },
  { name: "Burpees", repeats: 15, weight: 0 },
  { name: "Jump Rope", repeats: 100, weight: 0 },
  { name: "Rowing Machine", repeats: 1, weight: 0 },
  { name: "Stair Climber", repeats: 1, weight: 0 },
  { name: "High Knees", repeats: 30, weight: 0 },
]

// Workout templates
const workoutTemplates = [
  {
    title: "Upper Body Strength",
    exercises: upperBodyExercises,
    daysAgo: [1, 8, 15, 22],
  },
  {
    title: "Lower Body Power",
    exercises: lowerBodyExercises,
    daysAgo: [2, 9, 16, 23],
  },
  {
    title: "Core Stability",
    exercises: coreExercises,
    daysAgo: [3, 10, 17, 24],
  },
  {
    title: "Cardio Blast",
    exercises: cardioExercises,
    daysAgo: [4, 11, 18, 25],
  },
  {
    title: "Full Body Workout",
    exercises: [...upperBodyExercises.slice(0, 3), ...lowerBodyExercises.slice(0, 3), ...coreExercises.slice(0, 2)],
    daysAgo: [5, 12, 19, 26],
  },
  {
    title: "HIIT Session",
    exercises: [...cardioExercises.slice(0, 4), ...coreExercises.slice(0, 4)],
    daysAgo: [6, 13, 20, 27],
  },
  {
    title: "Push Day",
    exercises: upperBodyExercises.filter((ex) =>
      ["Bench Press", "Overhead Press", "Tricep Extensions", "Push-ups"].includes(ex.name || ""),
    ),
    daysAgo: [0, 7, 14, 21, 28],
  },
  {
    title: "Pull Day",
    exercises: upperBodyExercises.filter((ex) =>
      ["Lat Pulldown", "Bicep Curls", "Dumbbell Rows", "Pull-ups"].includes(ex.name || ""),
    ),
    daysAgo: [1, 8, 15, 22, 29],
  },
]

// Generate a date for a specific number of days ago
const getDateDaysAgo = (daysAgo: number): string => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString()
}

// Generate a single workout with random variations
const generateWorkout = (template: (typeof workoutTemplates)[0], daysAgo: number): Workout => {
  // Create workout items with unique IDs
  const items: WorkoutItem[] = template.exercises
    .slice(0, Math.floor(Math.random() * 3) + 4) // Random number of exercises (4-6)
    .map((exercise) => ({
      id: uuidv4(),
      name: exercise.name || "",
      // Add some variation to the repeats and weight
      repeats: exercise.repeats ? Math.max(1, exercise.repeats + Math.floor(Math.random() * 5) - 2) : 0,
      weight: exercise.weight ? Math.max(0, exercise.weight + Math.floor(Math.random() * 10) - 5) : 0,
    }))

  return {
    id: uuidv4(),
    title: template.title,
    date: getDateDaysAgo(daysAgo),
    items,
  }
}

// Generate all mock workouts
export const generateMockWorkouts = (): Workout[] => {
  const workouts: Workout[] = []

  // Generate workouts for each template and each day in the daysAgo array
  workoutTemplates.forEach((template) => {
    template.daysAgo.forEach((daysAgo) => {
      workouts.push(generateWorkout(template, daysAgo))
    })
  })

  // Sort by date (newest first)
  return workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Initialize mock data in local storage
export const initializeMockData = (): void => {
  if (typeof window === "undefined") return

  // Only initialize if no workouts exist yet
  const existingWorkouts = localStorage.getItem("workouts")
  if (!existingWorkouts || JSON.parse(existingWorkouts).length === 0) {
    const mockWorkouts = generateMockWorkouts()
    localStorage.setItem("workouts", JSON.stringify(mockWorkouts))
  }
}

